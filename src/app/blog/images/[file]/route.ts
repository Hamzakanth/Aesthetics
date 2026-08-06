import fs from "node:fs"
import path from "node:path"

/**
 * Post pictures live beside the posts, in `src/content/blog/images/`, so a
 * post and everything it shows sit in one folder and move together.
 *
 * Nothing under `src/` is web-served, so this route is the bridge: it maps
 * `/blog/images/name.jpg` onto that folder. `next/image` treats the URL as a
 * normal same-origin image and optimises it as usual.
 */
const IMAGES_DIR = path.join(process.cwd(), "src", "content", "blog", "images")

/** Extension → what the browser is told it is received. */
const TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
}

/** Every file in the folder becomes a static asset at build time. */
export function generateStaticParams() {
  if (!fs.existsSync(IMAGES_DIR)) return []

  return fs
    .readdirSync(IMAGES_DIR)
    .filter((file) => TYPES[path.extname(file).toLowerCase()])
    .map((file) => ({ file }))
}

export const dynamicParams = false

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string }> }
) {
  const { file } = await params

  // The name arrives from the URL, so it is matched against a shape rather
  // than trusted — no separators, no `..`, no walking out of the folder.
  if (!/^[a-zA-Z0-9._-]+$/.test(file) || file.startsWith(".")) {
    return new Response("Not found", { status: 404 })
  }

  const type = TYPES[path.extname(file).toLowerCase()]
  if (!type) return new Response("Not found", { status: 404 })

  const filePath = path.join(IMAGES_DIR, file)
  if (!fs.existsSync(filePath)) return new Response("Not found", { status: 404 })

  return new Response(fs.readFileSync(filePath), {
    headers: {
      "Content-Type": type,
      // Filenames are stable and a changed picture ships under a new name, so
      // this can be cached hard.
      "Cache-Control": "public, max-age=31536000, immutable",
      // An SVG is a document as much as an image; this stops one from pulling
      // in scripts or anything else if a writer uploads one.
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'",
    },
  })
}
