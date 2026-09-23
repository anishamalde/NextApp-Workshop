# Step 6: Test scrolling performance on Vega

The Hello World app now includes the horizontal movie list from Step 5. In this step, you'll measure whether moving through that list renders smoothly on Vega.

Choose one of two supported paths:

- **Guided path — ADBT:** Ask an AI coding assistant with Amazon Devices Builder Tools to run and interpret the workflow.
- **Manual path — Vega Studio or CLI:** Run KPI Visualizer and inspect its reports yourself using Amazon's documented commands.

Both paths use the same UI-fluidity KPI and default scrolling scenario. Start with an unprofiled baseline, then collect CPU profiling data only if the baseline needs investigation. Do not optimize the list until you have measurement evidence.

## 6.1 Understand the measurement

The Vega UI-fluidity KPI measures the percentage of frames rendered smoothly during an interaction.

| Result | Meaning |
| ------ | ------- |
| `Fluidity %` ≥ 99% | Passing |
| `Fluidity %` < 99% | Failing; inspect the worst frame-drop window |
| No usable iterations | Inconclusive; check the device or test scenario and retry |

The default KPI Visualizer scenario scrolls the UI without requiring you to write an Appium test script. It performs two sets of horizontal scrolling—five left and five right—and two sets of vertical scrolling—five down and five up—with 900 ms between actions.

Amazon recommends a custom scenario when the predefined front-page scrolling does not represent the app's real interaction. For this workshop, use the default scenario, but confirm that its horizontal actions actually move focus through the movie list. Treat the result as inconclusive if they do not.

KPI Visualizer reports a P90 score calculated from three iterations. Use that P90 score for the official pass/fail decision; an arithmetic average may be recorded only as supplemental information.

## 6.2 Prepare the Vega app and test hardware

Run this step from the repository root. Use a physical Vega device for this workshop so that the result represents real Fire TV hardware. Appium can also automate virtual devices for functional testing, but a virtual-device result is not the performance baseline used in this exercise.

Confirm that the Vega CLI can see the connected device:

```bash
vega exec vda devices
```

If the list is empty, connect a physical Vega device before continuing.

For a consistent workshop baseline, build and install the Release configuration:

```bash
yarn workspace @multitv/vega build:release
vega device install-app --dir packages/vega -b Release
```

UI-fluidity testing also requires:

- Appium `2.2.2`
- The Vega `kepler` Appium driver `3.30.0`

If either dependency is missing, use Amazon's documented Appium installation flow. On the guided path, let ADBT perform this check and guide the installation.

Amazon's KPI Visualizer prerequisites also list `@amazon-devices/kepler-performance-api`. Confirm that the package is present and compatible with the repository's Vega SDK before measuring. On the guided path, ask ADBT to check this. On the manual path, use the package version documented for your installed SDK, then rebuild and reinstall the Release app if you add it.

Check that the host and device are ready:

```bash
vega exec perf doctor \
  --app-name=com.amazondeveloper.hellosharedworkspace.main
```

Resolve any errors reported by `perf doctor` before continuing.

## 6.3 Path A: Ask ADBT to measure the baseline

Open your AI coding assistant with Amazon Devices Builder Tools enabled and give it this request:

```text
Use Amazon Devices Builder Tools to measure UI fluidity for the Vega app in
packages/vega.

Use the default scrolling test and the Release build. Run the mandatory KPI
Visualizer preflight and perf doctor, then measure the baseline without CPU
profiling. Do not change application code.

Report the Fluidity % for every valid iteration, the P90 KPI score shown by
KPI Visualizer, the pass/fail status against the 99% target, and all granular
fluidity dips below 100%. If you calculate an average, label it supplemental.
Include the generated report and Perfetto trace paths.
```

ADBT will pause to confirm workflow inputs. For this project:

- Confirm the interactive app process name as `com.amazondeveloper.hellosharedworkspace.main`.
- Choose the **Default** scrolling scenario.
- Choose the **Release** build type.

These confirmation pauses are expected. They prevent the performance tools from profiling the wrong process, interaction, or build.

Before KPI Visualizer runs, ADBT should:

1. Verify that `vega exec vda devices` returns the physical device selected for the workshop.
2. Verify that the app process is installed.
3. Confirm the compatible Vega Performance API dependency is installed.
4. Verify Appium `2.2.2`.
5. Verify that the `kepler` driver is installed.
6. Run `vega exec perf doctor` and resolve readiness errors.

ADBT then runs the equivalent of:

```bash
vega exec perf kpi-visualizer \
  --kpi ui-fluidity \
  --app-name com.amazondeveloper.hellosharedworkspace.main
```

Let the default scenario finish without manually competing for focus input.

## 6.4 Path B: Measure the baseline manually

Use this path if Amazon Devices Builder Tools is not available or if you want to operate KPI Visualizer directly. The steps follow Amazon's [Measure App KPIs](https://developer.amazon.com/docs/vega/0.24/measure-app-kpis.html) and [Investigate UI Fluidity Issues](https://developer.amazon.com/docs/vega/0.24/investigate-ui-fluidity.html) documentation.

### Option 1: Use Vega Studio

1. Open the VS Code command palette.
2. Run **Vega: Launch App KPI Visualizer**. Older Vega Studio versions might show the command with a **Kepler:** prefix.
3. Select **Application UI Fluidity Test**.
4. Leave **Record CPU Profiler** unselected for the baseline.
5. When asked about a custom test scenario, choose **No** to use the default scrolling scenario.
6. Use the default three iterations.
7. Do not choose **Ignore trace loss** for a normal baseline. Amazon warns that ignoring trace loss can make the reported result appear better than the app's actual performance.
8. Let the test complete without sending competing remote or keyboard input.

### Option 2: Use the Vega CLI

Run KPI Visualizer directly:

```bash
vega exec perf kpi-visualizer \
  --kpi ui-fluidity \
  --iterations 3 \
  --app-name com.amazondeveloper.hellosharedworkspace.main
```

Omitting `--test-scenario` selects the default scrolling scenario. Omitting `--record-cpu-profiling` keeps the baseline unprofiled.

If more than one device is connected, append:

```text
--device-serial-number <physical-device-serial>
```

Do not add `--ignore-trace-loss` unless you are deliberately investigating an otherwise unusable trace and clearly label the result as potentially optimistic.

## 6.5 Review the KPI report

KPI Visualizer writes its output below the Vega package:

```text
packages/vega/generated/<timestamp>/
```

On the guided path, review ADBT's summary. On the manual path, review the CLI output or run **Vega: Open Recording View** from the VS Code command palette and select the generated KPI report.

Find:

- `Fluidity %` for each valid iteration
- The P90 KPI score shown by KPI Visualizer
- The average fluidity, if calculated, clearly labelled as supplemental
- `Granular Fluidity %` entries below 100%
- The iteration with the lowest score
- The generated KPI report and Perfetto trace paths

Record your baseline:

| Field | Your result |
| ----- | ----------- |
| Device | |
| Build type | Release |
| Fluidity iterations | |
| P90 KPI score | |
| Supplemental average | |
| Worst granular dip | |
| Status | Passing / Failing / Inconclusive |

If the P90 KPI score is at least 99%, stop here unless you want to investigate smaller dips as an optional exercise.

## 6.6 Investigate a failing result

If the P90 result is below 99%, repeat the same measurement with CPU profiling before authorizing code changes.

### Path A: Guided ADBT diagnosis

Give ADBT this request:

```text
Continue the Amazon Devices Builder Tools UI-fluidity diagnosis. Repeat the
same Release build and default scrolling scenario with CPU profiling enabled.
Run the required preflight, locate the hash-named source map matching the
Release JavaScript bundle, and do not edit application code.

Using the profiled run, find the worst iteration and its lowest
granular-fluidity timestamp. Analyze a two-second window around that point and
identify the application hot functions by self CPU time. If granular
timestamps are unavailable, use Perfetto analysis to locate the worst interval.

Report the evidence and recommended optimizations, but do not edit code yet.
```

ADBT should:

1. Use the lowest granular-fluidity timestamp to select the problem window.
2. Use Perfetto analysis only as a fallback when granular timestamps are unavailable.
3. Run hot-function analysis against the converted CPU trace.
4. Separate application functions from framework and library work.
5. Point each recommendation to the relevant source file or component.

### Path B: Manual Vega Studio diagnosis

First, calculate the SHA-256 hash of the Release JavaScript bundle:

```bash
shasum -a 256 \
  packages/vega/build/lib/rn-bundles/Release/index.bundle
```

Use the returned hash to locate this source map:

```text
packages/vega/build/lib/rn-bundles/Release/<bundle-hash>.bundle.map
```

The filename must contain the bundle hash. A generic map such as `index.bundle.map` is not the source map expected by the profiling workflow.

Repeat the test with CPU profiling:

```bash
vega exec perf kpi-visualizer \
  --kpi ui-fluidity \
  --record-cpu-profiling \
  --app-name com.amazondeveloper.hellosharedworkspace.main \
  --sourcemap-file-path <hash-named-bundle-map>
```

After the run:

1. Open the generated KPI report with **Vega: Open Recording View**.
2. Find the lowest point in the fluidity graph.
3. Expand the CPU profile graph at the same timestamp and inspect the flamegraph for application functions occupying the most time.
4. Open the matching `iter_<iteration-number>_vs_trace.protobuf` file in [Perfetto UI](https://ui.perfetto.dev/).
5. Inspect the `Toolkit/Render thread` around the dropped-frame interval for long or repeated rendering events.

These steps follow Amazon's [Identify UI Rendering Issues](https://developer.amazon.com/docs/vega/0.24/ui-rendering.html) guidance.

Common evidence to discuss includes repeated render work while focus moves, expensive image or layout updates, and application functions occupying the JavaScript thread during dropped-frame windows. Treat these as hypotheses until they appear in your trace.

If you decide to implement an optimization, rebuild and reinstall the same build type, rerun the same scenario, and compare the new result with your recorded baseline.

## 6.7 Discuss the result

Compare findings with another attendee:

1. Did you both obtain valid iterations?
2. Was the P90 KPI score at least 99%?
3. Did granular dips happen at the same point in the scroll?
4. Were the hottest functions application code or library code?
5. What evidence would justify changing the implementation?

Performance work is strongest when the baseline, trace evidence, code change, and repeated measurement form one continuous story.

## What you've learned

- **Measure before optimizing**: A visual impression of smoothness is not a performance baseline.
- **Two paths, one KPI**: ADBT automates the workflow, while Vega Studio and the CLI expose the same measurement directly.
- **Preflight matters**: Device state, app installation, Appium, the Performance API, and build type affect whether the result is usable.
- **Profiling can affect measurement**: Establish the baseline first, then enable CPU profiling when diagnosis is necessary.
- **Granular KPIs locate the problem**: The lowest time window tells you where to inspect the CPU trace.
- **Hot functions connect symptoms to code**: CPU attribution helps distinguish application work from platform or library work.
- **Repeatability proves improvement**: Use the same device, build type, and scrolling scenario before and after a change.

---

**Next:** [Step 7: Build a streaming TV experience with an AI prompt →](./step-07-build-streaming-tv-experience.md)
