# Next steps: Build a streaming TV experience with an AI prompt

You've built the shared app, added a movie list, and compared its scrolling performance. This optional next step shows how you can use a larger prompt to keep experimenting.

The prompt turns the Hello World screen into a small streaming-style TV experience with:

- A large featured movie
- A horizontal row of movies
- D-pad focus that updates the featured movie
- Simple video playback
- Shared code for Vega, Expo TV, and web

The result is inspired by the [React Native Multi-TV App Sample](https://github.com/AmazonAppDev/react-native-multi-tv-app-sample), but keeps the app small enough to explore during the workshop.

## Look at the example

Open the sample app and look for:

- How the focused movie stands out
- How focus changes the large image and title
- How a movie opens in the video player
- Which parts are shared between platforms

Use it for ideas rather than copying the whole app.

## Read the prompt

The prompt is in [`workshop/prompts/streaming-tv-prompt.txt`](./prompts/streaming-tv-prompt.txt):

```bash
cat workshop/prompts/streaming-tv-prompt.txt
```

It gives the coding assistant more detail than a normal workshop step because it describes the screen, focus behaviour, video playback, and checks to run.

You do not need to memorise it. Treat it as a starting point that you can change.

## Ask your coding assistant

Start your coding assistant from the repository root and ask:

```text
Read workshop/prompts/streaming-tv-prompt.txt and implement it in this
repository.

Read the existing workshop files and code first. Keep the implementation simple
and consistent with the patterns already used in the workshop.
```

Let the assistant inspect the project before it starts editing. It should reuse the shared package, scaling helpers, focus patterns, and platform-specific files you have already seen.

## Build and run

Build and run on Vega. In Vega Studio, click the play button in the sidebar. Or use the command line:

```bash
yarn vega:build
yarn vega:vvd:mseries  # or yarn vega:vvd:intel
```

Check that:

1. The first movie is focused.
2. Pressing Right updates the large movie image and title.
3. Pressing Select opens the video.
4. Play/Pause works.
5. Back or Exit returns to the movie row.

Run the web version as a quick second check:

```bash
yarn expotv:web
```

## Change the prompt

The prompt is meant to be edited. Try adding one more feature and ask your coding assistant to update the app.

For example:

- Add another movie row
- Add a movie details screen
- Add a Continue Watching row
- Change the colours and card sizes
- Add a search button
- Add captions or playback progress

Keep the first change small, build the app again, and check that D-pad focus still works.

## What you've learned

- A prompt can describe a feature in enough detail for a coding assistant to implement it.
- The same shared-code and platform-file patterns work for larger TV features.
- You can change the prompt and use it to explore your own ideas.
- Building and trying the result is still an important part of the workflow.

---

**Workshop complete:** You have built a shared multi-platform TV app, compared two list components, and created a starting point for further experiments.
