# Step 6: Compare scrolling performance on Vega

In this step, you'll compare the two movie list components you added in [Step 5](./step-05-movie-list.md):

- React Native `FlatList`
- The Vega Carousel

You'll run the same UI Fluidity test for both components on a physical Vega device, then compare the results.

Smooth scrolling is important on TV. Dropped frames can make navigation feel slow or unresponsive. Testing on a physical device gives you a measurable result from real hardware, so you can compare the two list components using evidence rather than appearance alone.

This also builds on the platform file extension pattern from [Step 2](./step-02-shared-header.md). You'll temporarily hide `MovieList.kepler.tsx` so Vega uses the shared `MovieList.tsx` file instead.

The Vega Virtual Device is useful for rehearsing the test scenario, but do not
use simulator scores for this comparison. Simulator performance reflects the
host computer rather than production Fire TV hardware.

Before continuing, launch the app and confirm that it still shows the Step 5
screen: the navigation tile row and the horizontal movie list must both be
visible. If you have already completed Step 7, restore the Step 5 screen before
running this comparison. Otherwise, the scenario below will not measure either
`MovieList` implementation.

## 6.1 Understand what you'll measure

UI Fluidity measures how smoothly the app renders while focus moves through the list.

| Result | Meaning |
| ------ | ------- |
| `Fluidity %` > 99% | Passing |
| `Fluidity %` ≤ 99% | Needs improvement |
| No usable result | Check the device and confirm that the test moved through the movie list |

KPI Visualizer runs three iterations and displays a P90 score. Record that score for each component.

Do not use KPI Visualizer's generic default scrolling test for this app. The app
starts with focus on the Home tile, so generic D-pad actions can remain in the
tile row instead of entering the movie list. In section 6.3, you'll create one
custom scenario that navigates to Movies, moves focus up into the list, and
scrolls horizontally. Use that same script for both measurements.

## 6.2 Prepare the Vega device

Use the same physical Vega device, Release build, and scrolling test for both measurements. This makes the comparison meaningful.

Run the commands in this step from the repository root. Check that your device is connected:

```bash
vega exec vda devices
```

If the list is empty, connect a physical Vega device before continuing. See [Step 1: Run on a Fire TV Stick](./step-01-setup-and-run.md#run-on-a-fire-tv-stick) if you need to configure the device.

Copy the physical device serial from the first column and use it throughout the
step:

```bash
DEVICE_SERIAL=YOUR_PHYSICAL_DEVICE_SERIAL
```

UI Fluidity testing requires Appium `2.2.2` and the Vega `kepler` Appium driver
`3.30.0`. Check the installed versions first:

```bash
appium --version
appium driver list
```

The version command must print `2.2.2`, and the driver list must show `kepler`
`3.30.0` as installed. If either dependency is missing, install it:

```bash
npm install -g appium@2.2.2
appium driver install \
  --source=npm @amazon-devices/appium-kepler-driver@3.30.0
```

Do not reinstall a driver that already has the required version. If a different
Appium or `kepler` driver version is installed, follow Amazon's
[Appium installation guide](https://developer.amazon.com/docs/vega/0.24/appium-install.html)
to remove the incompatible version before installing the required one.

Amazon's general KPI Visualizer prerequisites also list
`@amazon-devices/kepler-performance-api`. This UI-only scenario does not call
its app-side marker APIs, so it is not required for this workshop measurement.
Only install it if `perf doctor` or your installed Vega SDK explicitly reports
that it is missing:

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

Read the final doctor summary rather than relying only on the command's exit
code. Resolve relevant errors and warnings — especially device connectivity,
network, app installation, Appium, and driver issues — before continuing.

On some physical Vega device and CLI combinations, `perf doctor` can report
that the network is disconnected even though the device is online. If that is
the only remaining warning, confirm that VDA remains connected and that the app
can load its remote catalog or images. If both checks pass, note the warning and
continue. Do not ignore the warning if app content also fails to load.

## 6.3 Create and run the movie-list scenario

Generate a custom scenario from the template supplied by the installed Vega
SDK:

```bash
vega exec perf generate-test-template \
  --app-name com.amazondeveloper.hellosharedworkspace.main \
  --test-scenario-save-path workshop/movie-list-fluidity.py
```

The generated file already imports `time` and defines a `TestRunner` class.
Inside that class, add `_press`, then replace the generated `prep` and `run`
method bodies with the following:

```python
    KEY_LEFT = "105"
    KEY_RIGHT = "106"
    KEY_UP = "103"
    KEY_DOWN = "108"

    def _press(self, key_code: str, delay: float = 0.9) -> None:
        if self.__driver is None:
            raise RuntimeError("Appium driver is not available")

        self.__driver.execute_script(
            "jsonrpc: injectInputKeyEvent",
            [{"inputKeyEvent": key_code, "holdDuration": 0}],
        )
        time.sleep(delay)

    def prep(self) -> None:
        # Normalize focus after launch: leave the movie row if necessary,
        # move to the first tile, then focus Movies.
        time.sleep(2)
        self._press(self.KEY_DOWN)
        for _ in range(4):
            self._press(self.KEY_LEFT, delay=0.3)
        self._press(self.KEY_RIGHT)
        self._press(self.KEY_RIGHT)

        # Wait for the catalog, enter the list, and warm the same poster range
        # before each measured iteration.
        time.sleep(5)
        self._press(self.KEY_UP)
        for _ in range(10):
            self._press(self.KEY_RIGHT)
        for _ in range(10):
            self._press(self.KEY_LEFT)
        time.sleep(2)

    def run(self) -> None:
        # Only this repeated horizontal scrolling is measured.
        for _ in range(10):
            self._press(self.KEY_RIGHT)
        for _ in range(10):
            self._press(self.KEY_LEFT)
```

`prep` places both implementations in the same ready state and returns focus to
the first poster. `run` contains only the interaction whose fluidity you want to
compare. Watch the first iteration and confirm that focus enters the movie list
and moves across posters. Stop the test and fix the scenario if it remains in
the tile row.

KPI Visualizer closes the app after each iteration and launches it again for the
next one. A brief app exit between iterations is expected; the Fire TV
screensaver replacing the app during the scenario is not.

Keep the TV awake and wake it with the physical remote immediately before
starting the measurement. If the screensaver appears while KPI Visualizer is
preparing or running, cancel the test, wake the device, relaunch the app, and
start again. Do not press remote buttons during the measured `run` section,
because extra input would make the comparison invalid.

You can run the measurement with Amazon Devices Builder Tools (ADBT), or
directly with Vega Studio or the CLI. Use the same option and the same scenario
file for both components.

### Option A: Use ADBT

Give your AI coding assistant this prompt:

```text
Use Amazon Devices Builder Tools to measure UI Fluidity for the installed Vega
app com.amazondeveloper.hellosharedworkspace.main.

Use workshop/movie-list-fluidity.py as the custom test scenario, the physical
device serial from DEVICE_SERIAL, three iterations, and no CPU profiling. Do
not change application code. Request the P90 report with
--show-percentiles 90.

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
5. Choose **Yes** when asked for a custom test scenario.
6. Select `workshop/movie-list-fluidity.py`.
7. Use three iterations.

You can run the same test from the command line:

```bash
vega exec perf kpi-visualizer \
  --kpi ui-fluidity \
  --iterations 3 \
  --app-name com.amazondeveloper.hellosharedworkspace.main \
  --device-serial-number "$DEVICE_SERIAL" \
  --test-scenario workshop/movie-list-fluidity.py \
  --show-percentiles 90
```

After the test, use **Vega: Open Recording View** to open the report.

An Appium-driven run can leave the separate **Key pressed latency** and
**Key released latency** rows empty, which may make the final validator print
`VALUE VALIDATION FAILED`. For this exercise, the UI Fluidity result is usable
when all three iterations complete, **Fluidity % P90** is numeric, and you
observed focus moving through the movie posters. Do not use a run where the
movie list did not actually scroll, the report shows `null` or `N/A` fluidity,
or the report contains no measured rendering surfaces.

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
