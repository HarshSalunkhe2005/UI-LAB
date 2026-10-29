// Minimal zip reader and writer for the skill packager. Node built-ins only.
// Writer: deterministic (fixed timestamp, sorted entries, deflate), files only, unix mode 0644.
// Reader: parses the central directory; reports each entry's unix mode so callers can spot symlinks.
import { crc32, deflateRawSync, inflateRawSync } from 'node:zlib'

const DOS_TIME = 0 // 00:00:00
const DOS_DATE = (2026 - 1980) << 9 | 1 << 5 | 1 // 2026-01-01, fixed so builds are reproducible

export function writeZip(files) {
  // files: [{ name: 'ui-lab/SKILL.md', data: Buffer }]
  const entries = [...files].sort((a, b) => (a.name < b.name ? -1 : 1))
  const parts = []
  const central = []
  let offset = 0
  for (const f of entries) {
    const name = Buffer.from(f.name, 'utf8')
    const raw = Buffer.from(f.data)
    const packed = deflateRawSync(raw, { level: 9 })
    const useDeflate = packed.length < raw.length
    const body = useDeflate ? packed : raw
    const crc = crc32(raw)
    const local = Buffer.alloc(30)
    local.writeUInt32LE(0x04034b50, 0)
    local.writeUInt16LE(20, 4) // version needed
    local.writeUInt16LE(0x0800, 6) // flags: UTF-8 names
    local.writeUInt16LE(useDeflate ? 8 : 0, 8)
    local.writeUInt16LE(DOS_TIME, 10)
    local.writeUInt16LE(DOS_DATE, 12)
    local.writeUInt32LE(crc, 14)
    local.writeUInt32LE(body.length, 18)
    local.writeUInt32LE(raw.length, 22)
    local.writeUInt16LE(name.length, 26)
    local.writeUInt16LE(0, 28)
    parts.push(local, name, body)

    const c = Buffer.alloc(46)
    c.writeUInt32LE(0x02014b50, 0)
    c.writeUInt16LE((3 << 8) | 20, 4) // made by: unix, v2.0
    c.writeUInt16LE(20, 6)
    c.writeUInt16LE(0x0800, 8)
    c.writeUInt16LE(useDeflate ? 8 : 0, 10)
    c.writeUInt16LE(DOS_TIME, 12)
    c.writeUInt16LE(DOS_DATE, 14)
    c.writeUInt32LE(crc, 16)
    c.writeUInt32LE(body.length, 20)
    c.writeUInt32LE(raw.length, 24)
    c.writeUInt16LE(name.length, 28)
    c.writeUInt32LE(((0o100644) << 16) >>> 0, 38) // regular file, rw-r--r--
    c.writeUInt32LE(offset, 42)
    central.push(c, name)
    offset += local.length + name.length + body.length
  }
  const cd = Buffer.concat(central)
  const end = Buffer.alloc(22)
  end.writeUInt32LE(0x06054b50, 0)
  end.writeUInt16LE(entries.length, 8)
  end.writeUInt16LE(entries.length, 10)
  end.writeUInt32LE(cd.length, 12)
  end.writeUInt32LE(offset, 16)
  return Buffer.concat([...parts, cd, end])
}

export function readZip(buf) {
  let eocd = -1
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65557); i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) { eocd = i; break }
  }
  if (eocd < 0) throw new Error('Not a zip file (no end-of-central-directory record)')
  const count = buf.readUInt16LE(eocd + 10)
  let p = buf.readUInt32LE(eocd + 16)
  const out = []
  for (let n = 0; n < count; n++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) throw new Error('Corrupt central directory')
    const madeBy = buf.readUInt16LE(p + 4)
    const flags = buf.readUInt16LE(p + 8)
    const method = buf.readUInt16LE(p + 10)
    const crc = buf.readUInt32LE(p + 16)
    const csize = buf.readUInt32LE(p + 20)
    const nameLen = buf.readUInt16LE(p + 28)
    const extraLen = buf.readUInt16LE(p + 30)
    const commentLen = buf.readUInt16LE(p + 32)
    const ext = buf.readUInt32LE(p + 38)
    const lho = buf.readUInt32LE(p + 42)
    const name = buf.toString(flags & 0x0800 ? 'utf8' : 'latin1', p + 46, p + 46 + nameLen)
    const dataStart = lho + 30 + buf.readUInt16LE(lho + 26) + buf.readUInt16LE(lho + 28)
    const body = buf.subarray(dataStart, dataStart + csize)
    let data
    if (method === 0) data = Buffer.from(body)
    else if (method === 8) data = inflateRawSync(body)
    else throw new Error(`Unsupported compression method ${method} for ${name}`)
    if (crc32(data) !== crc) throw new Error(`CRC mismatch for ${name}`)
    const unixMode = madeBy >> 8 === 3 ? ext >>> 16 : 0
    out.push({ name, data, unixMode, isDir: name.endsWith('/') })
    p += 46 + nameLen + extraLen + commentLen
  }
  return out
}
