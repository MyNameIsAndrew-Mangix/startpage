# Homely
I don't like using bookmarks, and I haven't look into optimizing them if it's possible. This app works with an extension and an API to get, store, and open groups of tabs at a time. Let's be honest, most people have windows filled with tabs they don't want to close.
**Link to project:** coming soon (looking for hosting service)
![Screenshot_2023-09-12_14-36-55](https://github.com/MyNameIsAndrew-Mangix/startpage/assets/67389882/6430d251-4c35-498b-a737-ad8ce5e297ab)


## How It's Made:

**Tech used:** HTML, CSS, Typescript, Node + Express, React, MongoDB

Since my background is in mostly strongly typed languages like C#, and when I dabbled in C, Java, and others, I decided to make this with (mostly)typescript, because this project is for myself and I'm no masochist. Did it add extra work? Yeah. Did I learn a lot from it? Yeah. It was really interesting looking up the browser extension APIs. I found that for some reason, Firefox was using the Chrome API. I still kept cross-compatible code just in code, but it really surprised me. The worst part by far was trying to figure out how to get dndkit to work how I wanted it to. Between me overcomplicating it at times, and the documentation being a bit lacking, it was by far the biggest hurdle.

# Optimizations
If I had more time available to me, I'd definitely improve the data structure. I'm using subdocuments and I'm not a fan. I'd also like to add SSO, so users don't have to log in through the react app and still have to sign in through the extension or vice versa

## Lessons Learned:

Creating extensions is a lot simpler than I thought, and I learned how much not having utility CSS classes sucks. I was told about Vite, which looks like it could make the workflow significantly better. 
### Huge benefit learning dndkit
One of my brainchild projects is an online card game engine(?). The idea is users will have the option to add games that aren't already added, via visual programming. This visual programming will use drag-and-drop blocks and more than likely, google's blockly. I thought about making my own scratch-like language, but there are already so many out there, and it seems like a huge undertaking.

### Future Updates:
Finish up the extension and find this baby a hosting service to deploy it on
Give this sucker better styling
Make a workspace's site list editable through a modal dialogue



Thinking about adding: 
Add a news feed section
Add the classic weather app.
Grab an inspirational quote generator and slap that baby on
Making the themes customizable
Built-in terminal?
