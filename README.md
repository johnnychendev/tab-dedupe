# Tab Dedupe (Ungrouped)

A tiny Chrome extension that stops duplicate tabs: when a tab opens a URL that is already open, it switches to the existing tab and closes the new one.

Tabs inside tab groups are ignored. That makes it safe to use alongside browser agents such as Claude in Chrome, which work in their own tab group and break when a duplicate-tab extension closes the tab they just opened.

## How it works

- Only `http` and `https` pages are checked. New Tab pages and `chrome://` pages are left alone.
- A tab inside any tab group is never closed, and is never used as the "existing" tab to switch to.
- URLs are compared without the `#` fragment. The path, the query string, and the trailing slash all count.

| Case | Example | Treated as duplicate? |
| --- | --- | --- |
| Different `#` fragment | `/page#faq` vs `/page#pricing` | Yes |
| Different query string | `?variant=1` vs `?variant=2` | No |
| Different path | `/blog` vs `/blog/post` | No |
| Trailing slash on a path | `/page` vs `/page/` | No |
| Different scheme or host | `http://` vs `https://`, `www.` vs no `www.` | No |

Sites that use the `#` fragment for routing (such as `app.example.com/#/settings`) will see their second tab closed.

## Install

The extension is not on the Chrome Web Store. Load it unpacked:

1. Download or clone this repository.
2. Open `chrome://extensions` and turn on **Developer mode**.
3. Click **Load unpacked** and select the repository folder.
4. Turn off any other duplicate-tab extension, so the two do not fight over the same tabs.

Chrome may show a "Disable developer mode extensions" prompt on startup. Dismiss it to keep the extension running.

## Permissions and privacy

The only permission is `tabs`, which is needed to read tab URLs. Nothing is stored, collected, or sent anywhere.

## License

[MIT](LICENSE)
