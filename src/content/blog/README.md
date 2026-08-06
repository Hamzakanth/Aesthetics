# Publishing a post

No CMS, no login, no developer. A post is one file in this folder. Add the
file, open a pull request, and when it is merged the site rebuilds and the
post is live — usually inside two minutes.

## The five-minute version

1. In GitHub, open this folder (`src/content/blog`) and click **Add file → Create new file**.
2. Name it `your-post-title.mdx`. **The filename is the web address**, so
   `rebooking-is-an-interval-problem.mdx` becomes
   `/blog/rebooking-is-an-interval-problem`. Lowercase letters, numbers and
   hyphens only — no spaces, no capitals, no underscores.
3. Copy everything out of [`_template.mdx`](./_template.mdx) into it.
4. Replace the frontmatter and write the post.
5. Click **Propose new file**, then **Create pull request**. Ask someone to
   review it. Merging publishes it.

## The frontmatter

The block between the two `---` lines at the very top. Every field below is
required except the last two.

| Field | What it is |
| --- | --- |
| `title` | The headline. Shown on the card, the post page, and in Google. |
| `excerpt` | One or two sentences. The card summary and the search-result description. |
| `category` | Exactly one of the six below. Drives the filter buttons on /blog. |
| `date` | `YYYY-MM-DD`. Sorts the page — newest first. |
| `author` | The byline, written how you want it to read. |
| `version` | Optional. Product updates only, e.g. `v2.8`. Shows as a chip. |
| `featured` | Optional. `true` pins this post to the big slot at the top. Only use it on one post at a time. |
| `image` | Optional. The banner, e.g. `/blog/images/waitlist-screen.jpg`. See below. |
| `imageAlt` | Optional. What the banner shows, for a screen reader. Defaults to the title, which is rarely a good description. |

Allowed categories, spelled exactly like this:

`Product update` · `Front of house` · `Retention` · `Case study` ·
`Client data` · `Company`

Notes:

- Wrap a title or excerpt in double quotes if it contains a colon.
- Do **not** add a reading time. "6 min read" is counted from your words.
- The date is a publish stamp, not a schedule. A future date will still go
  live as soon as the post is merged — it just sorts to the top.

## Writing the body

Everything under the frontmatter is normal Markdown: `##` for a section
heading, `-` for a bullet, `**bold**`, `[text](/link)`. The template shows
each one. You never write HTML and never touch a colour or a font — the site
styles it.

## Pictures

Every picture — the banner and anything inside the post — goes in the same
place: the [`images`](./images) folder, right next to the posts. In GitHub,
open that folder, click **Add file → Upload files**, and drop the picture into
the *same* pull request as the post. A post that mentions a file nobody
uploaded builds fine and shows a hole.

Wherever you write the path, it is the filename with `/blog/images/` in front
of it. A picture saved as `waitlist-screen.jpg` is written
`/blog/images/waitlist-screen.jpg`.

**Name the file for what it shows**, lowercase with hyphens:
`waitlist-screen.jpg`, `nail-bar-front-desk.jpg`. Everyone shares this one
folder, so `hero.jpg` or `image1.jpg` will collide with someone else's and one
of you will quietly overwrite the other.

**Save it around 1600 pixels wide and under about 500 KB.** That is wide
enough for a full-width banner on a large screen and small enough that the
page still opens quickly on a phone in a salon with bad signal. The site makes
the smaller sizes itself — you do not need to export several.

### The banner

Add it to the frontmatter:

```
image: /blog/images/waitlist-screen.jpg
imageAlt: The waitlist screen with three clients queued for a Thursday slot
```

One line, four places: it appears at the top of the post, on the post's card
on /blog, on the big lead card if this post is featured, and as the preview
picture when someone shares the link on LinkedIn, WhatsApp or X. Leave `image`
out and all four fall back to the plain text treatment, which is fine — a post
does not need a banner.

You can also point `image` at a full `https://` address if the picture already
lives somewhere public. It is used as-is.

### Pictures inside the post

Reference them by path in the body:

```
![The waitlist screen with three clients queued](/blog/images/waitlist-screen.jpg)
```

The text in the square brackets does two jobs: it is printed under the picture
as the caption, and it is what a screen reader says. So write a sentence that
earns its place on the page — describe what is in the picture, not
"screenshot". If the picture is decorative and the words around it already say
everything, leave the brackets empty — `![](/blog/images/divider.jpg)` — and no
caption is printed.

### When a post comes down

If a post is deleted or a picture is swapped out, delete the old file from the
`images` folder in the same pull request. Nothing else points at it, so
anything left behind just sits there being shipped to every visitor forever.

## Drafts

A file whose name starts with an underscore is ignored — `_half-finished.mdx`
will not appear on the site. Rename it when it is ready. Otherwise, an
unmerged pull request is the draft: nothing is public until it lands on the
main branch.

## When something breaks

The build fails loudly rather than shipping a broken page. If a pull request
goes red, the error names the file and the problem — nearly always a
misspelled category, a date that is not `YYYY-MM-DD`, or a missing field.
Fix it in the same pull request and it goes green.

Pictures are the exception: they fail quietly, because the build cannot know
what you meant to upload. If something looks wrong on the page rather than in
the pull request, start here.

| What you see | What it usually is |
| --- | --- |
| A broken picture, or a blank space where the banner should be | The filename in the post does not match the file in the `images` folder — a capital letter, `.jpg` written as `.jpeg`, or a hyphen missing. The path is case-sensitive: `Waitlist-Screen.jpg` and `waitlist-screen.jpg` are two different files. |
| The picture's path printed on the page as text, e.g. `![A waitlist screen](/blog/images/waitlist.jpg)` | The markdown is mistyped. It is `![description](/path.jpg)` — exclamation mark first, square brackets around the description, round brackets around the path, and no space between the `]` and the `(`. |
| The build fails naming your `image` field | The banner path is not written in full. `waitlist.jpg` and `images/waitlist.jpg` both need to be `/blog/images/waitlist.jpg`. |
| The right picture, but the page is slow | The file is far larger than 500 KB. Re-export it at about 1600 pixels wide. |

## How it works, in one paragraph

The site reads this folder at build time. Every `.mdx` file here becomes a
page, gets added to the sitemap for Google, and appears on `/blog` in date
order. Nothing is registered anywhere else — adding the file is the whole
job.
