# Step 6: Compare scrolling performance on Vega

In this step, you'll compare the two movie list components you added in [Step 5](./step-05-movie-list.md):

- React Native `FlatList`
- The Vega Carousel

You'll run the same UI Fluidity test for both components on a physical Vega device, then compare the results.

Smooth scrolling is important on TV. Dropped frames can make navigation feel slow or unresponsive. Testing on a physical device gives you a measurable result from real hardware, so you can compare the two list components using evidence rather than appearance alone.

This also builds on the platform file extension pattern from [Step 2](./step-02-shared-header.md). You'll temporarily hide `MovieList.kepler.tsx` so Vega uses the shared `MovieList.tsx` file instead.

You can use the Vega Virtual Device to rehearse the test, but run the comparison
on a physical device. Simulator scores reflect the host computer rather than
production Fire TV hardware.

Before you start, launch the app and check that the navigation tiles and
horizontal movie list from Step 5 are visible. The test only measures
`MovieList` when this screen is active.

## 6.1 Understand what you'll measure

UI Fluidity measures how smoothly the app renders while focus moves through the list.

| Result | Meaning |
| ------ | ------- |
| `Fluidity %` > 99% | Passing |
| `Fluidity %` ≤ 99% | Needs improvement |
| No usable result | Check the device and confirm that the test moved through the movie list |

KPI Visualizer runs three iterations and displays a P90 score. Record that score for each component.

KPI Visualizer's default test sends repeated horizontal and vertical D-pad
actions. In this app, the horizontal actions move focus from the Home tile to
Movies. Step 5 then gives the movie list preferred focus, so the remaining
Left/Right actions scroll through the posters. Use this same default test for
both measurements.

## 6.2 Prepare the Vega device

Use the same physical Vega device, Release build, and scrolling test for both measurements. This makes the comparison meaningful.

Run the commands in this step from the repository root. Check that your device is connected:

```bash
vega exec vda devices
```

If the list is empty, connect a physical Vega device before continuing. See [Step 1: Run on a Fire TV Stick](./step-01-setup-and-run.md#run-on-a-fire-tv-stick) if you need to configure the device.

Copy the physical device serial shown in the output and use it throughout the
step:

```bash
DEVICE_SERIAL=YOUR_PHYSICAL_DEVICE_SERIAL
```

UI Fluidity testing requires Appium `2.2.2` and the Vega `kepler` driver
`3.30.0`. Check whether they are already installed:

```bash
appium --version
appium driver list
```

You should see Appium `2.2.2` and `kepler` `3.30.0`. If either is missing,
install it:

```bash
npm install -g appium@2.2.2
appium driver install \
  --source=npm @amazon-devices/appium-kepler-driver@3.30.0
```

If a different version is installed, follow Amazon's
[Appium installation guide](https://developer.amazon.com/docs/vega/0.24/appium-install.html)
to remove it before installing the required version.

The general KPI Visualizer prerequisites also list
`@amazon-devices/kepler-performance-api`. You do not need it for this UI-only
test because UI Fluidity does not use its app-side marker APIs. If your Vega SDK
reports that it is missing, install it:

```bash
yarn workspace @multitv/vega add \
  @amazon-devices/kepler-performance-api
```

Check that the app and device are ready:

```bash
vega exec perf doctor \
  --app-name=com.amazondeveloper.hellosharedworkspace.main \
  --device-serial-number "$DEVICE_SERIAL"
```

Read the final summary and resolve any relevant errors or warnings before
continuing.

On some physical devices, `perf doctor` can report a network warning even when
the device is online. If it is the only warning, check that VDA is still
connected and that the app can load its movie images. If both work, continue.

## 6.3 Run the default UI Fluidity test

The default test is enough for this comparison because Step 5 gives the movie
list preferred focus when it appears. Use the default test for both components.

Watch the first iteration and check that focus moves across the movie posters.
KPI Visualizer closes and relaunches the app between iterations, so a brief exit
is expected. If the screensaver appears, cancel the test, wake the device, and
start again. Do not use the remote while the test is running, because extra
input would change the comparison.

You can run the measurement with Amazon Devices Builder Tools (ADBT), or
directly with Vega Studio or the CLI. Use the same option for both components.

### Option A: Use ADBT

Give your AI coding assistant this prompt:

```text
Use Amazon Devices Builder Tools to measure UI Fluidity for the installed Vega
app com.amazondeveloper.hellosharedworkspace.main.

Use the default UI Fluidity test, the physical device serial from DEVICE_SERIAL,
three iterations, and no CPU profiling. Do not change application code. Request
the P90 report with --show-percentiles 90.

Report the P90 Fluidity score and whether the test moved focus horizontally
through the movie list.
```

The assistant should run the device, app, Appium, and driver preflight before
starting KPI Visualizer.

### Option B: Use Vega Studio or the CLI

In Vega Studio:

1. Open the VS Code command palette.
2. Run **Vega: Launch App KPI Visualizer**.
3. Select **Application UI Fluidity Test**.
4. Leave **Record CPU Profiler** unselected.
5. Choose **No** when asked for a custom test scenario.
6. Use three iterations.

You can run the same test from the command line:

```bash
vega exec perf kpi-visualizer \
  --kpi ui-fluidity \
  --iterations 3 \
  --app-name com.amazondeveloper.hellosharedworkspace.main \
  --device-serial-number "$DEVICE_SERIAL" \
  --show-percentiles 90
```

After the test, use **Vega: Open Recording View** to open the report.

An Appium run can leave **Key pressed latency** and **Key released latency**
empty, causing the final validator to print `VALUE VALIDATION FAILED`. You can
still use the UI Fluidity result when all three iterations complete, the
**Fluidity % P90** value is numeric, and you saw the posters scroll. Discard a
run that shows `null`, `N/A`, or no measured rendering surfaces.

These steps follow Amazon's [Measure App KPIs](https://developer.amazon.com/docs/vega/0.24/measure-app-kpis.html) documentation.

## 6.4 Measure FlatList

Vega automatically selects `MovieList.kepler.tsx`, which uses the Carousel. This is the same platform file resolution you used for the Header in Step 2.

To switch to `FlatList`, hide the Vega-specific file by temporarily renaming it. Do not delete it. With the `.kepler.tsx` file hidden, Vega falls back to the shared `MovieList.tsx` implementation:

```bash
mv \
  packages/shared/src/components/MovieList/MovieList.kepler.tsx \
  packages/shared/src/components/MovieList/MovieList.kepler.tsx.hidden
```

Build and install the Release app on your physical device:

```bash
yarn workspace @multitv/vega build:release
vega device install-app \
  --device "$DEVICE_SERIAL" \
  --dir packages/vega \
  -b Release
```

Run the measurement using Option A or Option B, then record the P90 score:

| Component | P90 Fluidity |
| --------- | ------------- |
| FlatList | |

## 6.5 Measure the Vega Carousel

Restore the Vega-specific file:

```bash
mv \
  packages/shared/src/components/MovieList/MovieList.kepler.tsx.hidden \
  packages/shared/src/components/MovieList/MovieList.kepler.tsx
```

Build and install the Release app on the same device:

```bash
yarn workspace @multitv/vega build:release
vega device install-app \
  --device "$DEVICE_SERIAL" \
  --dir packages/vega \
  -b Release
```

Run the same measurement again and record the P90 score:

| Component | P90 Fluidity |
| --------- | ------------- |
| Vega Carousel | |

Make sure `MovieList.kepler.tsx` has been restored before moving to the next workshop section.

## 6.6 Compare the results

Bring the two measurements together:

| Component | P90 Fluidity | Passed >99%? |
| --------- | ------------- | ----------- |
| FlatList | | Yes / No |
| Vega Carousel | | Yes / No |

Discuss:

1. Which component produced the higher score?
2. Did both components pass the >99% target?
3. Was the difference large enough to notice while scrolling?
4. Why is using the same device, build type, and test important?

Do not assume that the Carousel will always produce a particular number. Device state, images, background activity, and the exact focus path can affect the result. The useful outcome is learning how to make a repeatable comparison.

If you want to investigate a failing result after the workshop, Amazon's [Investigate UI Fluidity Issues](https://developer.amazon.com/docs/vega/0.24/investigate-ui-fluidity.html) guide explains CPU profiling and trace analysis.

## What you've learned

- **Measure both implementations**: A performance claim is stronger when both components run through the same test.
- **Keep the comparison fair**: Use the same physical device, Release build, and focus path.
- **Read the score**: KPI Visualizer reports the P90 result from three iterations.
- **Keep the workshop focused**: Detailed CPU and Perfetto analysis can come later if a result needs deeper investigation.

---

**Next:** [Next steps: Build a streaming TV experience with an AI prompt →](./step-07-next-steps.md)
