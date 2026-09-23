# Step 6: Test scrolling performance with Amazon Devices Builder Tools

The Hello World app now includes the horizontal movie list from Step 5. In this step, you'll use Amazon Devices Builder Tools (ADBT) to measure whether moving through that list renders smoothly on Vega.

You will run the supported UI-fluidity workflow with the default scrolling scenario, collect CPU profiling data, and review any frame drops. Start by measuring a baseline—do not optimize the list until you know what the trace says.

## 6.1 Understand the measurement

The Vega UI-fluidity KPI measures the percentage of frames rendered smoothly during an interaction.

| Result | Meaning |
| ------ | ------- |
| `Fluidity %` ≥ 99% | Passing |
| `Fluidity %` < 99% | Failing; inspect the worst frame-drop window |
| No usable iterations | Inconclusive; check the device or test scenario and retry |

The default ADBT scenario scrolls the UI without requiring you to write an Appium test script. Recording CPU profiling at the same time gives ADBT the trace data it needs to identify expensive functions if the KPI fails.

## 6.2 Prepare the Vega app and physical device

Run this step from the repository root. Performance analysis requires a physical Vega device; the Vega Virtual Device cannot be used for this exercise.

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

The ADBT preflight will verify the device connection and app installation. UI-fluidity testing also requires:

- Appium `2.2.2`
- The Vega `kepler` Appium driver `3.30.0`

If either dependency is missing, let ADBT guide you through the supported installation workflow instead of guessing versions.

## 6.3 Ask ADBT to measure the baseline

Open your AI coding assistant with Amazon Devices Builder Tools enabled and give it this request:

```text
Use Amazon Devices Builder Tools to measure UI fluidity for the Vega app in
packages/vega.

Use the default scrolling test and the Release build. Run the mandatory KPI
Visualizer preflight, record CPU profiling, and measure the baseline only.
Do not change application code.

Report the Fluidity % for every valid iteration, the average, the pass/fail
status against the 99% target, and all granular fluidity dips below 100%.
Include the generated report and trace file paths.
```

ADBT will pause to confirm workflow inputs. For this project:

- Confirm the interactive app process name as `com.amazondeveloper.hellosharedworkspace.main`.
- Choose the **Default** scrolling scenario.
- Choose the **Release** build type.

These confirmation pauses are expected. They prevent the performance tools from profiling the wrong process, interaction, or build.

## 6.4 Follow the preflight

Before KPI Visualizer runs, ADBT should complete these checks in order:

1. Verify that `vega exec vda devices` returns a physical device.
2. Verify that the app process is installed.
3. Verify Appium `2.2.2`.
4. Verify that the `kepler` driver is installed.
5. Locate the JavaScript bundle for the selected build.
6. Calculate the bundle hash and select the matching hash-named source map.

For the Release build, the source map should resemble:

```text
packages/vega/build/lib/rn-bundles/Release/<bundle-hash>.bundle.map
```

The filename must contain the bundle hash. A generic map such as `index.bundle.map` is not the source map expected by this workflow.

After preflight, ADBT runs the equivalent of:

```bash
vega exec perf kpi-visualizer \
  --kpi ui-fluidity \
  --record-cpu-profiling \
  --app-name com.amazondeveloper.hellosharedworkspace.main \
  --sourcemap-file-path <hash-named-bundle-map>
```

Let the default scenario finish without manually competing for focus input.

## 6.5 Review the KPI report

KPI Visualizer writes its output below the Vega package:

```text
packages/vega/generated/<timestamp>/
```

Review ADBT's summary and find:

- `Fluidity %` for each valid iteration
- The average fluidity
- `Granular Fluidity %` entries below 100%
- The iteration with the lowest score
- The generated KPI report, Perfetto trace, and converted CPU trace paths

Record your baseline:

| Field | Your result |
| ----- | ----------- |
| Device | |
| Build type | Release |
| Fluidity iterations | |
| Average fluidity | |
| Worst granular dip | |
| Status | Passing / Failing / Inconclusive |

If the KPI is at least 99%, stop here unless you want to investigate smaller dips as an optional exercise.

## 6.6 Investigate a failing result

If the result is below 99%, ask ADBT to continue with trace analysis before authorizing code changes:

```text
Continue the Amazon Devices Builder Tools UI-fluidity diagnosis using the
generated report and traces.

Find the worst iteration and its lowest granular-fluidity timestamp. Analyze a
two-second window around that point and identify the application hot functions
by self CPU time. If granular timestamps are unavailable, use Perfetto analysis
to locate the worst interval.

Report the evidence and recommended optimizations, but do not edit code yet.
```

ADBT should:

1. Use the lowest granular-fluidity timestamp to select the problem window.
2. Use Perfetto analysis only as a fallback when granular timestamps are unavailable.
3. Run hot-function analysis against the converted CPU trace.
4. Separate application functions from framework and library work.
5. Point each recommendation to the relevant source file or component.

Common evidence to discuss includes repeated render work while focus moves, expensive image or layout updates, and application functions occupying the JavaScript thread during dropped-frame windows. Treat these as hypotheses until they appear in your trace.

If you decide to implement an optimization, rebuild and reinstall the same build type, rerun the same scenario, and compare the new result with your recorded baseline.

## 6.7 Discuss the result

Compare findings with another attendee:

1. Did you both obtain valid iterations?
2. Was the average above the 99% target?
3. Did granular dips happen at the same point in the scroll?
4. Were the hottest functions application code or library code?
5. What evidence would justify changing the implementation?

Performance work is strongest when the baseline, trace evidence, code change, and repeated measurement form one continuous story.

## What you've learned

- **Measure before optimizing**: A visual impression of smoothness is not a performance baseline.
- **Preflight matters**: Device state, app installation, Appium, build type, and source maps all affect whether the result is usable.
- **Granular KPIs locate the problem**: The lowest time window tells you where to inspect the CPU trace.
- **Hot functions connect symptoms to code**: CPU attribution helps distinguish application work from platform or library work.
- **Repeatability proves improvement**: Use the same device, build type, and scrolling scenario before and after a change.

---

**Next:** [Step 7: Build a streaming TV experience with an AI prompt →](./step-07-build-streaming-tv-experience.md)
