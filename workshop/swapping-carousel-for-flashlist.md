# Swapping the Vega Carousel for FlashList

A short guide for developers who have a Vega app using `@amazon-devices/vega-carousel` and want to try `FlashList` instead — either to reuse a FlashList codebase from Android TV / Apple TV, or to compare the two on Fire TV.

The trick is not the list API (FlashList's is nearly identical to `FlatList`). It's the **module resolution** — FlashList doesn't run natively on Vega out of the box, so you need the Amazon-wrapped build and a Metro alias.

## The two packages

| Package | Where it comes from | What it is |
|---|---|---|
| `@shopify/flash-list` | npm (community) | The public FlashList. Runs on iOS, Android, and web. Won't run on Vega as-is. |
| `@amazon-devices/shopify__flash-list` | Amazon npm (Vega scope) | Amazon's wrapper around the community package with Vega-compatible native bindings pre-linked. Same JS API, drop-in replacement on Fire TV. |

The wrapper is not a fork — it re-exports the community module, so any code you write against `@shopify/flash-list` also works against the wrapped version. The wrapper only exists to satisfy Vega's native module linking.

> Note the double underscore in `shopify__flash-list`. That's Amazon's npm scope convention for wrapping org-scoped packages: `@shopify/flash-list` on public npm becomes `shopify__flash-list` under `@amazon-devices/`.

## Step 1 — Install the wrapped package on the Vega workspace

From the repo root:

```bash
yarn workspace @multitv/vega add @amazon-devices/shopify__flash-list
```

Only the Vega package needs the wrapper. If you also want FlashList on Expo TV, install the community package on that workspace:

```bash
yarn workspace @multitv/expotv add @shopify/flash-list
```

## Step 2 — Alias the module in `packages/vega/metro.config.js`

This is the VMRP (Vega Module Resolver Preset) trick. It lets your shared code import from the community name (`@shopify/flash-list`) while Vega bundles the Amazon build. Same pattern used for Lottie.

Open `packages/vega/metro.config.js` and add an entry to `extraNodeModules`:

```js
extraNodeModules: {
  'lottie-react-native': path.resolve(
    projectRoot,
    'node_modules',
    '@amazon-devices',
    'lottie-react-native',
  ),
  '@shopify/flash-list': path.resolve(
    projectRoot,
    'node_modules',
    '@amazon-devices',
    'shopify__flash-list',
  ),
},
```

After this, `import {FlashList} from '@shopify/flash-list'` in any shared file resolves to the Amazon wrapper when bundled for Vega, and to the community package when bundled for web / Android TV / Apple TV. No `Platform.select()` needed.

## Step 3 — Create a FlashList variant of the movie list

Create `packages/shared/src/components/MovieList/MovieListFlash.tsx`:

```tsx
import React from 'react';
import {Text, ActivityIndicator, StyleSheet} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {TVFocusGuideView} from '@amazon-devices/react-native-kepler';
import {useMovies, Movie} from '../../data/catalog';
import {MoviePoster} from './MoviePoster';
import {scaleFontSize, scaleWidth, scaleHeight} from '../../utils/scaling';

export const MovieList = () => {
  const {movies, loading, error} = useMovies();

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#FFFFFF" style={styles.centered} />
    );
  }
  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }
  if (movies.length === 0) {
    return null;
  }

  return (
    <TVFocusGuideView autoFocus={true} style={styles.container}>
      <FlashList
        horizontal
        data={movies}
        keyExtractor={(item: Movie) => item.id}
        renderItem={({item}) => <MoviePoster movie={item} />}
        estimatedItemSize={scaleWidth(510)}
        showsHorizontalScrollIndicator={false}
      />
    </TVFocusGuideView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: scaleHeight(400),
    paddingHorizontal: scaleWidth(20),
  },
  centered: {flex: 1},
  error: {color: '#FFFFFF', fontSize: scaleFontSize(40)},
});
```

Three things worth calling out:

- The component **exports the same name** (`MovieList`) as the existing Carousel and FlatList variants. That's what makes the swap in Step 4 a one-line change.
- **`estimatedItemSize`** is the one FlashList prop with no `FlatList`/`Carousel` equivalent. It tells FlashList roughly how wide each row is so it can pre-allocate view slots. Get it wrong and you'll see pop-in on fast scroll. Here it's poster width (480) plus row margin (30).
- **`TVFocusGuideView autoFocus`** — FlashList doesn't hand focus into its children on its own the way the Vega Carousel does. Wrapping it in a focus guide keeps the Up-arrow-into-the-list behaviour working.

## Step 4 — Swap the import

Edit `packages/shared/src/screens/HomeScreen.tsx`. Change one line:

```tsx
// Before (Carousel on Vega, FlatList elsewhere):
import {MovieList} from '../components/MovieList/MovieList';

// After (FlashList on Vega, FlatList elsewhere):
import {MovieList} from '../components/MovieList/MovieListFlash';
```

That's the whole swap. Rebuild:

```bash
yarn vega:build
yarn vega:vvd:mseries  # or yarn vega:vvd:intel
```

On web / Android TV / Apple TV nothing changes — those platforms still resolve `MovieList.tsx` (the FlatList variant) via Metro's platform extensions. On Vega, the Carousel is gone and FlashList is in its place.

To go back to the Carousel, revert the import.

## The general pattern

This is the same three-part recipe you'd use for any wrapped React Native library on Vega:

1. `yarn workspace @multitv/vega add @amazon-devices/<wrapped-package>`
2. Add an `extraNodeModules` alias in `packages/vega/metro.config.js` mapping the community name to the wrapped one.
3. Import from the community name everywhere in shared code.

Same trick powers Lottie (`@amazon-devices/lottie-react-native`) and Carousel (`@amazon-devices/vega-carousel`). If you need a library that isn't already wrapped, check the [Vega supported libraries](https://developer.amazon.com/docs/vega-api/0.24/supported-libraries.html) list first.
