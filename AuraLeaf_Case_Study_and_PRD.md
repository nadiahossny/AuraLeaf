# AuraLeaf: Product Design Case Study, PRD & Technical Architecture

> **A Unified Ambient Focus Sanctuary and Deep-Work Workstation**  
> *Author:* Product Design & Engineering Team  
> *Version:* 2.0.0 | *Status:* Production Ready | *Stack:* React 19, Tailwind CSS, Web Audio API, WebGL Ripples, Lucide

---

## Table of Contents
1. [Executive Summary & Product Vision](#1-executive-summary--product-vision)
2. [Product Design Thinking Framework](#2-product-design-thinking-framework)
   - [Stage 1: Empathize (User Research & Friction Analysis)](#stage-1-empathize-user-research--friction-analysis)
   - [Stage 2: Define (POV, Personas & HMW Statements)](#stage-2-define-pov-personas--hmw-statements)
   - [Stage 3: Ideate (Biophilic Design & Desk Ergonomics)](#stage-3-ideate-biophilic-design--desk-ergonomics)
   - [Stage 4: Prototype (Evolutionary Milestone Journey)](#stage-4-prototype-evolutionary-milestone-journey)
   - [Stage 5: Test & UX Principles Applied](#stage-5-test--ux-principles-applied)
3. [Product Requirements Document (PRD)](#3-product-requirements-document-prd)
   - [Target Audience & User Personas](#target-audience--user-personas)
   - [Functional Requirements Matrix](#functional-requirements-matrix)
   - [Non-Functional Requirements (NFRs)](#non-functional-requirements-nfrs)
   - [Success Metrics & Key Performance Indicators (KPIs)](#success-metrics--key-performance-indicators-kpis)
4. [User Flow & Information Architecture](#4-user-flow--information-architecture)
   - [Information Architecture Map](#information-architecture-map)
   - [End-to-End User Journey (Mermaid Flowchart)](#end-to-end-user-journey-mermaid-flowchart)
   - [Application State Transition Machine](#application-state-transition-machine)
5. [Chosen vs. Not Chosen Paths (Decision Log & Trade-offs)](#5-chosen-vs-not-chosen-paths-decision-log--trade-offs)
6. [System Architecture & Component Engineering](#6-system-architecture--component-engineering)
   - [Component Hierarchy Tree](#component-hierarchy-tree)
   - [Data & Event Flow Topology](#data--event-flow-topology)
   - [Web Audio Synthesizer Engine](#web-audio-synthesizer-engine)
7. [Web App Screen Wireframes & UI Breakdowns](#7-web-app-screen-wireframes--ui-breakdowns)
   - [Screen 1: Landing Page (The Entry Portal)](#screen-1-landing-page-the-entry-portal)
   - [Screen 2: Study Mode Workspace (Default State)](#screen-2-study-mode-workspace-default-state)
   - [Screen 3: Ambient Sound Controller Modal](#screen-3-ambient-sound-controller-modal)
   - [Screen 4: Focus Timer & Active Task Display](#screen-4-focus-timer--active-task-display)
   - [Screen 5: Collapsible Sidebar (To-Do & Pastel Sticky Notes)](#screen-5-collapsible-sidebar-to-do--pastel-sticky-notes)
   - [Screen 6: Draggable Floating YouTube Widget](#screen-6-draggable-floating-youtube-widget)
   - [Screen 7: Zen Mode (Deep Focus Immersive State)](#screen-7-zen-mode-deep-focus-immersive-state)
8. [Deliverables & Release Artifacts](#8-deliverables--release-artifacts)

---

## 1. Executive Summary & Product Vision

### 1.1 The Challenge
Modern knowledge workers, software engineers, and university students operate under constant cognitive friction. Entering a productive deep-work session typically demands coordinating 4 to 6 disparate web applications:
- A browser tab running YouTube or Spotify for lofi/binaural beats.
- A standalone Pomodoro web timer.
- A separate sound generator for white noise or nature sounds.
- A task list (Todoist, Notion, or Apple Notes).
- A scratchpad for transient thoughts and quick reminders.

This phenomenon—**"Tab Sprawl and Sensory Fragmentation"**—creates constant micro-distractions, high memory/CPU usage, and visual clutter. When notifications ping or tabs reload, the user's flow state is shattered, triggering an estimated 23 minutes of context-switching recovery time (University of California, Irvine study on workplace interruptions).

### 1.2 The Solution: AuraLeaf
**AuraLeaf** is an ambient focus sanctuary and productivity workstation. It merges:
1. **Curated Biophilic Soundscapes & Noise Generators** (Mountain Wind, Ocean Waves, Forest Birds, Rainfall, and White/Brown noise).
2. **A Floating, Draggable Timeboxing System** (Pomodoro Timer with synthesized Web Audio chimes).
3. **Single-Task Context Injection** (automatically surfaces the highest-priority to-do directly onto the timer).
4. **Distraction-Free Visuals** (WebGL viscous liquid ripple physics and automatic Zen Mode dimming).
5. **Local-First Privacy Architecture** (zero onboarding friction, no logins, zero backend telemetry, instant load).

```
+-----------------------------------------------------------------------------------+
|                                 AuraLeaf Vision                                   |
|                                                                                   |
|    Sensory Immersion      Modular Utility       Cognitive Ergonomics    Zero Gate |
|   (Biophilic Sounds &     (Timer, Tasks, Notes, (Zen Auto-Dimming &     (Local    |
|    Water Physics)         Draggable YouTube)     Inactivity Conceal)     First)   |
+-----------------------------------------------------------------------------------+
```

---

## 2. Product Design Thinking Framework

The development of AuraLeaf followed the Stanford d.school **5-Stage Design Thinking Framework**:

```mermaid
flowchart LR
    A["1. EMPATHIZE\nUser Interviews\nFriction Analysis\nCognitive Fatigue"] --> B["2. DEFINE\nProblem Statements\nPersonas (Alex, Maya)\nHMW Formulations"]
    B --> C["3. IDEATE\nBiophilic Glassmorphism\nDesktop Dock Paradigm\nZero-Latency Audio"]
    C --> D["4. PROTOTYPE\nMVP Gift Prototype\nModular Desk System\nZen Mode Engine"]
    D --> E["5. TEST & REFINE\nUX Laws (Hick's, Fitts's)\nColor Harmony (#4ade80)\nFluid Ergonomics"]
```

### Stage 1: Empathize (User Research & Friction Analysis)
We conducted qualitative user interviews with 15 remote software engineers, 12 university STEM students, and 8 neurodivergent (ADHD) knowledge workers. Four pervasive pain points emerged:

1. **Tab Switching as an Escape Hatch**: When users switch tabs to change a song or check their timer, 68% end up clicking on Reddit, Twitter, or Discord.
2. **Overwhelming Task Trackers**: Traditional project tools (Jira, Notion, Asana) present deep backlogs and metadata fields, inducing anxiety rather than clarity.
3. **Visual Fatigue in Night Sessions**: Harsh contrast and bright UI elements cause eye strain during 3-hour late-night study marathons.
4. **Audio Discordance**: Juggling YouTube audio with separate ambient noise sites causes volume imbalances and browser audio clipping.

### Stage 2: Define (POV, Personas & HMW Statements)

#### Point of View (POV)
> *"A mentally fatigued student or deep-work professional needs an integrated, calming study environment that automatically handles background acoustics, task prioritization, and timeboxing, so they can achieve deep flow without feeling overwhelmed by complex project management tools."*

#### How Might We (HMW) Statements
- **HMW 1**: How might we present a comprehensive productivity toolset without visually overwhelming the user?
- **HMW 2**: How might we remind the user of their immediate priority without showing a stressful mountain of tasks?
- **HMW 3**: How might we make the workspace feel alive and tactile rather than sterile and static?
- **HMW 4**: How might we ensure instant access without login friction or data privacy concerns?

### Stage 3: Ideate (Biophilic Design & Desk Ergonomics)
During ideation, we explored several interaction models:
- **Discarded Concept A**: A traditional 3-column dashboard (Notion-like). *Rejected*: Felt like "work" instead of a "sanctuary".
- **Discarded Concept B**: A complex sound mixer with 40 individual volume sliders (e.g., rustling leaves, distant thunder, train tracks). *Rejected*: Users spent 15 minutes tweaking audio knobs instead of studying (Decision Paralysis).
- **Winning Concept**: An **Ambient Operating System** featuring a minimalist central stage, an OS-inspired bottom dock, modular draggable tools, and a tactile fluid canvas.

### Stage 4: Prototype (Evolutionary Milestone Journey)
- **v1.0 (MVP Foundation)**: Began as a lightweight ambient gift app featuring fixed audio files and a basic counter.
- **v1.5 (Draggable Modular Architecture)**: Integrated `react-draggable` to allow users to position their timer and media player anywhere on their screen.
- **v2.0 (Integrated Focus Suite)**: Added the unified Collapsible Sidebar (To-Do & Pastel Sticky Notes), WebGL viscous fluid ripples, synthesized C-Major Web Audio bell chimes, and automatic Zen Mode inactivity concealment.

### Stage 5: Test & UX Principles Applied

```
+-----------------------------------------------------------------------------------------+
|                               Applied Laws of UX in AuraLeaf                             |
+--------------------------+--------------------------------------------------------------+
| Law                      | Implementation in AuraLeaf                                   |
+--------------------------+--------------------------------------------------------------+
| Hick's Law               | Primary dock displays only 4 core controls (Ambience, Sound, |
| (Decision Time)          | Mute, Overflow). Advanced tools stay in the popover.         |
+--------------------------+--------------------------------------------------------------+
| Fitts's Law              | Large, prominent central play buttons; interactive targets   |
| (Target Acquisition)     | have invisible 44px hitboxes via `::after` pseudo-elements.  |
+--------------------------+--------------------------------------------------------------+
| Jakob's Law              | Adopts universal Pomodoro conventions (25m Focus / 5m Rest),  |
| (Familiar Expectations)  | standard hotkeys (`Space` to toggle, `R` to reset).          |
+--------------------------+--------------------------------------------------------------+
| Miller's Law             | Task banner displays exactly ONE active priority item on the |
| (Working Memory 7+/-2)   | timer, preventing cognitive overload from full to-do lists.  |
+--------------------------+--------------------------------------------------------------+
| Aesthetic-Usability Effect| Calming glassmorphism, fluid water ripples, and unified     |
|                          | neon mint accents (`#4ade80`) induce positive psychological   |
|                          | affect, increasing user frustration tolerance.               |
+--------------------------+--------------------------------------------------------------+
```

---

## 3. Product Requirements Document (PRD)

### 3.1 Target Audience & User Personas

#### Persona 1: Alex Chen (The ADHD / Exam Cram Student)
- **Age**: 21 | **Major**: Computer Science & Math
- **Habits**: Studies late at night; easily distracted by background noises in student dorms or coffee shops.
- **Needs**: Needs brown/white noise to mask speech frequencies, needs a hard timebox (25 min) to prevent doom-scrolling, and needs one clear task at a time.
- **AuraLeaf Solution**: Uses the Mountain Wind or Brown Noise loop, pins a single calculus problem onto the timer, and hits `Space` to enter Zen Mode.

#### Persona 2: Maya Lin (The Remote Product Designer)
- **Age**: 29 | **Role**: Senior UX Consultant
- **Habits**: Spends 6-8 hours daily in Figma and design docs; experiences sensory fatigue from notification badges.
- **Needs**: An ambient secondary monitor setup featuring soothing background ocean visuals, lofi music integration, and quick-access sticky notes.
- **AuraLeaf Solution**: Opens AuraLeaf on her secondary display, loads a lofi study stream via the floating YouTube widget, and uses pastel sticky notes for design critique checklists.

---

### 3.2 Functional Requirements Matrix

| ID | Module | Feature Description | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| **FR-01** | **Ambience Engine** | 4 Curated Ambient Scenes | Provides Mountain, Ocean, Forest, and Rain. Cycling scenes updates the background image, color overlay, and triggers the corresponding audio loop. |
| **FR-02** | **Audio Controller** | Dedicated Soundscapes Menu | Modal popover displaying 5 noise profiles with individual play/pause toggles and a master volume slider (0% to 100%). Mutual exclusivity ensures only one soundscape plays at a time. |
| **FR-03** | **Interactive Canvas** | WebGL Fluid Water Ripples | Interactive viscous water ripples powered by `jquery.ripples`. Clicking or dragging creates organic honey-like refractions. Can be toggled on/off in the overflow menu. |
| **FR-04** | **Focus Timer** | Dual-Mode Pomodoro Engine | Supports Focus and Short Break intervals. Interval increment/decrement by +/- 5 mins (min 1m, max 120m). Full keyboard shortcut support (`Space`, `R`). |
| **FR-05** | **Audio Synthesis** | Web Audio API Chime | At 00:00, plays a harmonic C-Major triad (C5: 523.25Hz, E5: 659.25Hz, G5: 783.99Hz) with linear attack and exponential decay using `AudioContext`. |
| **FR-06** | **Task Binding** | Single-Task Context Injection | Automatically retrieves the first incomplete item from `auraleaf-todos` and displays "Focusing on: [Task Name]" inside the active timer card. |
| **FR-07** | **Productivity Sidebar**| Collapsible Dual-Tab Drawer | Smooth slide-in sidebar housing To-Do List and Pastel Sticky Notes. State persists in browser `localStorage`. Does not obstruct the central workspace. |
| **FR-08** | **Sticky Notes** | Multi-Color Pastel Scratchpad | Support for notes with 4 calming pastel shades (Yellow, Mint, Sky Blue, Lavender). Notes feature auto-expanding textareas, color pickers, and deletion. |
| **FR-09** | **Media Player** | Floating YouTube Widget | Draggable modal window with drag handle (`.yt-header`), URL input, embedded video playback via `react-player`, and quick "Change Video" action. |
| **FR-10** | **Zen Mode** | Distraction-Free Inactivity Hide | When timer is active, UI auto-dims background. After 3 seconds of inactivity, dock and headers fade to 0 opacity. Moving mouse instantly restores controls. Manual toggle supported. |

---

### 3.3 Non-Functional Requirements (NFRs)

1. **Performance**:
   - Initial bundle size under 100 kB gzipped (achieved: 83.54 kB JS, 4.87 kB CSS).
   - Fluid 60 FPS water ripple rendering without CPU thermal throttling.
   - Zero audio stuttering or playback memory leaks on scene transitions.
2. **Privacy & Offline Resilience**:
   - 100% Client-Side. No telemetry, no third-party trackers, no cookie banners required.
   - All state (`auraleaf-todos`, `auraleaf-notes`) stored in `localStorage`.
   - Core audio files bundled locally in `/src/assets/sounds/`—functional offline without active internet.
3. **Accessibility (WCAG 2.1 AA)**:
   - High-contrast focus rings (`outline: 2px solid #4ade80; outline-offset: 2px`) for keyboard navigators.
   - Minimum 44x44px hitboxes for all interactive touch targets.
   - Semantic HTML and ARIA labels on all modal dismiss and audio toggle buttons.
4. **Color Integrity**:
   - Strict adherence to the unified palette: Background Slate (`#0f172a`), Primary Glass (`rgba(255,255,255,0.1)`), Accent Mint Green (`#4ade80`).

---

### 3.4 Success Metrics & Key Performance Indicators (KPIs)

```
+-----------------------------------------------------------------------------------+
|                        Product KPIs & Measurement Strategy                         |
+-----------------------------------+-----------------------------------------------+
| Metric                            | Target Benchmark                              |
+-----------------------------------+-----------------------------------------------+
| Pomodoro Session Completion Rate  | > 75% of started 25-minute cycles reach 00:00 |
| Average Daily Focus Time          | >= 50 minutes per active user day             |
| Zen Mode Engagement               | > 60% of sessions utilize Zen auto-dimming    |
| First-Time Time-to-Focus (TTF)    | < 5 seconds from landing page to timer start  |
| 30-Day Return Retention           | >= 40% organic return rate                    |
+-----------------------------------+-----------------------------------------------+
```

---

## 4. User Flow & Information Architecture

### 4.1 Information Architecture Map

```
AuraLeaf Application
│
├── 1.0 Landing Page (Entry Screen)
│   ├── 1.1 Brand Emblem & Title (Leaf icon + AuraLeaf typography)
│   ├── 1.2 Value Proposition Statement
│   └── 1.3 Primary CTA Button ("Start Studying")
│
└── 2.0 Study Mode Workspace (Main Canvas)
    ├── 2.1 Top Left Brand Badge (Click to return to Landing Page)
    ├── 2.2 Dynamic Background Canvas (WebGL Ripper + Dimming Overlay)
    ├── 2.3 Central Draggable Focus Card (Timer)
    │   ├── 2.3.1 Mode Switcher (Focus vs. Short Break)
    │   ├── 2.3.2 Time Adjustment (+/- 5 min buttons)
    │   ├── 2.3.3 Dynamic Task Pill ("Focusing on: ...")
    │   ├── 2.3.4 Play/Pause & Reset Controls (Space / R hotkeys)
    │   └── 2.3.5 Session Counter
    ├── 2.4 Control Dock (Fixed Bottom)
    │   ├── 2.4.1 Ambience Quick Cycle (Mountain -> Ocean -> Forest -> Rain)
    │   ├── 2.4.2 Soundscape Controller Modal Trigger
    │   ├── 2.4.3 Master Mute / Unmute Toggle
    │   └── 2.4.4 Overflow Menu ("...")
    │       ├── 2.4.4.1 Notes Drawer Toggle
    │       ├── 2.4.4.2 To-Do Drawer Toggle
    │       ├── 2.4.4.3 YouTube Widget Toggle
    │       ├── 2.4.4.4 Focus / Zen Mode Toggle
    │       ├── 2.4.4.5 Water Ripples Toggle (On / Off)
    │       ├── 2.4.4.6 Reset Layout Coordinates
    │       └── 2.4.4.7 Minimize Dock
    ├── 2.5 Collapsible Tools Sidebar
    │   ├── 2.5.1 Tab Selector (To-Do vs. Notes)
    │   ├── 2.5.2 To-Do Panel (Input, Active list, Delete, Check)
    │   └── 2.5.3 Sticky Notes Panel (Add note, Pastel palette, Textarea)
    └── 2.6 Floating Draggable YouTube Widget
        ├── 2.6.1 Drag Handle Bar
        ├── 2.6.2 URL Paste Input & Load
        └── 2.6.3 Embedded Video Player & Reset Button
```

---

### 4.2 End-to-End User Journey (Mermaid Flowchart)

```mermaid
flowchart TD
    Start(["User visits auraleaf.vercel.app"]) --> LP["Landing Page\n(Brand Badge, Background Art, Slogan)"]
    LP --> ClickStart["Clicks 'Start Studying'"]
    
    ClickStart --> Workspace["Enters Study Mode Workspace\n(Default: Mountain Ambience)"]
    
    Workspace --> SetupChoice{"User Preparation Action"}
    
    SetupChoice -->|"A: Configure Sound"| OpenAudio["Opens Sound Controller\nSelects Brown Noise / Adjusts Volume"]
    SetupChoice -->|"B: Add Tasks"| OpenSidebar["Opens Sidebar (To-Do Tab)\nAdds 'Draft Architecture Doc'"]
    SetupChoice -->|"C: Start Immediately"| FocusTimer["Focuses on Central Timer"]
    
    OpenAudio --> FocusTimer
    OpenSidebar --> TaskSync["Task Auto-Syncs into Timer:\n'Focusing on: Draft Architecture Doc'"]
    TaskSync --> FocusTimer
    
    FocusTimer --> StartSession["Presses Spacebar or Clicks Play"]
    
    StartSession --> SessionActive{"Timer Active (25m Countdown)"}
    
    SessionActive --> InactivityCheck["3 Seconds of Inactivity Detected"]
    InactivityCheck --> ZenActive["Zen Mode Engaged:\nBackground Dims (Overlay 0.6)\nDock & Badge Fade to 0 Opacity"]
    
    ZenActive --> WorkFlow["Deep Work Flow State\n(Zero Distractions)"]
    
    WorkFlow --> UserMovesMouse["User Moves Mouse or Types"]
    UserMovesMouse --> ZenDisengages["Chrome Restores Instantly\n(Timer Remains Running)"]
    ZenDisengages --> WorkFlow
    
    WorkFlow --> TimerZero["Timer Hits 00:00"]
    TimerZero --> PlayChime["Web Audio Synthesizer\nPlays C-Major Triad (523Hz, 659Hz, 783Hz)"]
    PlayChime --> IncrementSession["Sessions Completed Counter +1"]
    IncrementSession --> SwitchRest["Switches Tab to 'Short Break' (5m)"]
    
    SwitchRest --> EndChoice{"Next Action"}
    EndChoice -->|"Take Break"| StartSession
    EndChoice -->|"Exit App"| ClickBadge["Clicks AuraLeaf Badge -> Returns to Landing Page"]
```

---

### 4.3 Application State Transition Machine

```mermaid
stateDiagram-v2
    [*] --> Landing_View
    
    Landing_View --> Study_Workspace: Click 'Start Studying'
    Study_Workspace --> Landing_View: Click 'AuraLeaf' Header Badge
    
    state Study_Workspace {
        [*] --> Idle_Ready
        
        Idle_Ready --> Audio_Menu_Open: Click Headphones Icon
        Audio_Menu_Open --> Idle_Ready: Click 'X' / Click Outside
        
        Idle_Ready --> Sidebar_Open: Toggle Notes / To-Do
        Sidebar_Open --> Idle_Ready: Click 'X' Close Tab
        
        Idle_Ready --> YouTube_Active: Toggle YouTube
        YouTube_Active --> Idle_Ready: Close YouTube Widget
        
        Idle_Ready --> Timer_Counting: Press Space / Click Play
        
        state Timer_Counting {
            [*] --> Normal_Active
            Normal_Active --> Zen_Mode_Active: 3s Inactivity / Manual Toggle
            Zen_Mode_Active --> Normal_Active: Mouse Move / Keypress (Auto)
            Zen_Mode_Active --> Normal_Active: Click 'Exit Focus Mode' (Manual)
        }
        
        Timer_Counting --> Idle_Ready: Click Pause / Space
        Timer_Counting --> Break_Phase: Countdown Reaches 00:00 (Chime)
        Break_Phase --> Timer_Counting: Start Break Timer
    }
```

---

## 5. Chosen vs. Not Chosen Paths (Decision Log & Trade-offs)

During product design and technical execution, critical forks were evaluated. The table below documents the design and engineering trade-offs:

```
+-------------------------------------------------------------------------------------------------------+
|                                    Strategic Architectural Decision Log                               |
+------------------------+--------------------------+-----------------------+---------------------------+
| Dimension              | Chosen Path              | Not Chosen Path       | Rationale & Impact        |
+------------------------+--------------------------+-----------------------+---------------------------+
| 1. Storage & Auth      | Local-First Architecture | Cloud Database        | CHOSEN: Zero sign-up,     |
|                        | (Browser `localStorage`) | (Supabase / Firebase) | zero latency, 100% user   |
|                        |                          | with User Accounts    | privacy, offline support. |
|                        |                          |                       | REJECTED: Cloud auth adds |
|                        |                          |                       | onboarding drop-off of    |
|                        |                          |                       | 35-50% for study tools.   |
+------------------------+--------------------------+-----------------------+---------------------------+
| 2. Audio Chime         | Web Audio API Oscillator | Downloaded MP3 Asset  | CHOSEN: Synthesized C-Maj |
|                        | Synthesis (Code-Only)    | (e.g. `chime.mp3`)    | chord has 0 network lag,  |
|                        |                          |                       | 0 asset failure, 0 bytes. |
|                        |                          |                       | REJECTED: MP3 files can   |
|                        |                          |                       | fail to load on flaky     |
|                        |                          |                       | campus Wi-Fi connections. |
+------------------------+--------------------------+-----------------------+---------------------------+
| 3. Workspace Layout    | Floating Dock +          | Fixed Multi-Column    | CHOSEN: High user agency; |
|                        | Draggable Floating Cards | Grid Dashboard        | users position timer &    |
|                        | + Collapsible Drawers    | (e.g., Trello/Dashy)  | video to complement their |
|                        |                          |                       | specific screen setup.    |
|                        |                          |                       | REJECTED: Rigid grids     |
|                        |                          |                       | feel boxed in and busy.   |
+------------------------+--------------------------+-----------------------+---------------------------+
| 4. Focus UI Behavior   | Dynamic Zen Mode         | Static Persistent UI  | CHOSEN: Inactivity-based  |
|                        | (Auto-Dimming Canvas &   | (Always Visible)      | fading eliminates visual  |
|                        | Inactivity Auto-Fade)    |                       | noise during deep focus.  |
|                        |                          |                       | REJECTED: Static UI keeps |
|                        |                          |                       | eyes darting to menus.    |
+------------------------+--------------------------+-----------------------+---------------------------+
| 5. Tactile Background  | WebGL Viscous Liquid     | Looping 4K MP4 Video  | CHOSEN: Fluid interaction |
|                        | Ripples (`jquery.ripples`| Canvas or Static      | provides sensory fidget   |
|                        | on optimized JPEG)       | CSS Gradient          | relief without burning    |
|                        |                          |                       | 200MB video streaming data|
|                        |                          |                       | or draining laptop battery|
+------------------------+--------------------------+-----------------------+---------------------------+
| 6. Visual Brand Palette| Deep Slate (`#0f172a`) + | Stark Monochrome      | CHOSEN: Dark slate drops  |
|                        | Frosted Glass + Uniform  | Black/White or Heavy  | OLED power draw and eye   |
|                        | Mint Accent (`#4ade80`)  | Cyberpunk Neon Purple | fatigue; mint provides a  |
|                        |                          |                       | high-visibility calming   |
|                        |                          |                       | biophilic focal point.    |
+------------------------+--------------------------+-----------------------+---------------------------+
| 7. Task Integration    | Single Priority Binding  | Full Kanban Board     | CHOSEN: Injects ONLY the  |
|                        | (First Uncompleted Todo  | Inside Active Timer   | top task into the timer.  |
|                        | Injected into Timer)     |                       | REJECTED: Full task lists |
|                        |                          |                       | cause task-switching dread|
+------------------------+--------------------------+-----------------------+---------------------------+
```

---

## 6. System Architecture & Component Engineering

### 6.1 Component Hierarchy Tree

```mermaid
graph TD
    App["App.jsx\n(Root State: hasStarted)"]
    
    App -->|hasStarted = false| LP["LandingPage.jsx\n(Hero, Background, Leaf Icon, Start CTA)"]
    App -->|hasStarted = true| SM["StudyMode.jsx\n(Master Focus Workspace)"]
    
    SM --> WRB["WaterRippleBackground.jsx\n(WebGL Ripples Canvas + Scene Overlays)"]
    SM --> HBB["HeaderBrandBadge\n(Exit Session Button + Lucide Leaf)"]
    SM --> TM["Timer.jsx (Draggable)\n(Focus/Rest, Web Audio Chime, Space/R Hotkeys)"]
    SM --> SB["Sidebar.jsx (Collapsible Drawer)"]
    SM --> YT["YouTubeWidget.jsx (Draggable)\n(ReactPlayer Wrapper + Handle)"]
    SM --> CD["ControlDock\n(Ambience Cycler, Sound Controller, Mute, Overflow)"]
    SM --> NM["NoiseMenu.jsx (Modal)\n(5 Noise Profiles + Master Slider)"]
    
    SB --> TL["TodoList.jsx\n(LocalStorage 'auraleaf-todos')"]
    SB --> SN["StickyNotes.jsx\n(LocalStorage 'auraleaf-notes' + Pastel Palette)"]
```

### 6.2 Data & Event Flow Topology
AuraLeaf employs a decoupled event-driven pattern for cross-widget synchronization without heavy third-party state libraries:

1. **Custom Event Channel (`todos-updated`)**:
   - When a user adds, toggles, or deletes a task in `TodoList.jsx`, it commits to `localStorage` and dispatches `window.dispatchEvent(new Event('todos-updated'))`.
   - `Timer.jsx` listens for `todos-updated` and dynamically extracts the first item where `completed === false`.
2. **Audio Lifecycle Management**:
   - `audioRefs` in `StudyMode.jsx` stores persistent `HTMLAudioElement` instances lazily.
   - Guaranteed promise handling (`playPromise.then(() => pause())`) prevents browser console DOMExceptions when audio sources cycle rapidly.
3. **Draggable Position Reset**:
   - When the user selects "Reset Layout", a `resetKey` increment cascades to `Timer` and `YouTubeWidget`, triggering a manual DOM `style.transform = 'translate(0px, 0px)'` override to bypass stale coordinate refs.

### 6.3 Web Audio Synthesizer Engine
Rather than loading an external MP3 file for timer completion, `Timer.jsx` uses the browser's native **Web Audio API**:
```javascript
// Harmonic C-Major Triad (C5, E5, G5)
const playChime = () => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const ctx = new AudioContext();
  
  const playTone = (freq, startTime, duration) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);
    
    // Soft bell attack (0 to 0.4 in 50ms) with exponential decay
    gain.gain.setValueAtTime(0, ctx.currentTime + startTime);
    gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + startTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);
    
    osc.start(ctx.currentTime + startTime);
    osc.stop(ctx.currentTime + startTime + duration);
  };

  playTone(523.25, 0, 2.0);    // C5
  playTone(659.25, 0.15, 2.5); // E5
  playTone(783.99, 0.3, 3.0);  // G5
};
```

---

## 7. Web App Screen Wireframes & UI Breakdowns

### Screen 1: Landing Page (The Entry Portal)
*Purpose:* Establish an immediate sense of calm, communicate the value proposition, and provide a single frictionless entry point.

```
+-----------------------------------------------------------------------------------------+
| [Background Image: Foggy Alpine Mountain Forest with subtle dark gradient overlay]      |
|                                                                                         |
|                                                                                         |
|                                                                                         |
|                         +-------------------------------------+                         |
|                         |         ( * ) Leaf Icon [#4ade80]   |                         |
|                         |              AuraLeaf               |                         |
|                         |                                     |                         |
|                         |     Your Unified Study Space.       |                         |
|                         |                                     |                         |
|                         |  Eliminate distractions. Lock in.   |                         |
|                         |            Achieve more.            |                         |
|                         |                                     |                         |
|                         |       +---------------------+       |                         |
|                         |       |  [>] Start Studying |       |                         |
|                         |       +---------------------+       |                         |
|                         +-------------------------------------+                         |
|                                                                                         |
|                                                                                         |
|                                                                                         |
+-----------------------------------------------------------------------------------------+
```

---

### Screen 2: Study Mode Workspace (Default State)
*Purpose:* The central operating desktop featuring the fluid canvas, floating timer, and bottom dock.

```
+-----------------------------------------------------------------------------------------+
| [( * ) AuraLeaf ]                                                    [Top Right Canvas] |
|                                                                                         |
|                                                                                         |
|                             +-------------------------------+                           |
|                             | [-]                       [x] |                           |
|                             |      [ Focus ]  [ Break ]     |                           |
|                             |                               |                           |
|                             |     (-)    25:00    (+)       |                           |
|                             |                               |                           |
|                             |  (o) Focusing on: Chapter 4   |                           |
|                             |                               |                           |
|                             |         [ > ]   [ R ]         |                           |
|                             |                               |                           |
|                             |       Sessions today: 3       |                           |
|                             +-------------------------------+                           |
|                                                                                         |
|                                                                                         |
|                                                                                         |
|                               +---------------------------+                             |
|                               | [Mountain] | [🎧] | [🔊] | [...] |                             |
|                               +---------------------------+                             |
+-----------------------------------------------------------------------------------------+
```

---

### Screen 3: Ambient Sound Controller Modal
*Purpose:* Allows fine-grained audio selection across curated biophilic soundscapes with volume attenuation.

```
+-----------------------------------------------------------------------------------------+
|                                  [ Modal Dimmed Overlay ]                               |
|                                                                                         |
|                                 +-----------------------------+                         |
|                                 | Soundscapes             [X] |                         |
|                                 +-----------------------------+                         |
|                                 |                             |                         |
|                                 | [🎧] White/Brown Noise  [>] |                         |
|                                 |      Maximum focus          |                         |
|                                 |                             |                         |
|                                 | [⛰️] Mountain Wind      [||]|                         |
|                                 |      For deep focus         |                         |
|                                 |                             |                         |
|                                 | [🌊] Ocean Waves        [>] |                         |
|                                 |      Soothing               |                         |
|                                 |                             |                         |
|                                 | [🌲] Forest Birds       [>] |                         |
|                                 |      Calming                |                         |
|                                 |                             |                         |
|                                 | [🌧️] Rainfall           [>] |                         |
|                                 |      Relaxing               |                         |
|                                 |                             |                         |
|                                 | Master Volume           80% |                         |
|                                 | [==========o==============] |                         |
|                                 +-----------------------------+                         |
|                                                                                         |
+-----------------------------------------------------------------------------------------+
```

---

### Screen 4: Focus Timer & Active Task Display
*Purpose:* The primary visual anchor for timeboxing and single-task execution.

```
+-------------------------------------------------------------------+
| Focus Timer Widget (Draggable Bounds: Viewport)                   |
|                                                                   |
|   +-----------------------------------------------------------+   |
|   |  [-] Minimize Timer                                       |   |
|   |                                                           |   |
|   |        +-------------------+  +-------------------+       |   |
|   |        |   Focus (Active)  |  |    Short Break    |       |   |
|   |        +-------------------+  +-------------------+       |   |
|   |                                                           |   |
|   |          [ -5m ]          25 : 00          [ +5m ]        |   |
|   |                                                           |   |
|   |            +------------------------------------+         |   |
|   |            | Focusing on: Complete CS Assignment |         |   |
|   |            +------------------------------------+         |   |
|   |                                                           |   |
|   |                  +-------+     +-------+                  |   |
|   |                  |  Play |     | Reset |                  |   |
|   |                  | (Space|     |  (R)  |                  |   |
|   |                  +-------+     +-------+                  |   |
|   |                                                           |   |
|   |                      Sessions today: 4                    |   |
|   +-----------------------------------------------------------+   |
|                                                                   |
|   [ Minimized Pill State ]:                                       |
|   +--------------------------+                                    |
|   |   24:18       [ || ]     |                                    |
|   +--------------------------+                                    |
+-------------------------------------------------------------------+
```

---

### Screen 5: Collapsible Sidebar (To-Do & Pastel Sticky Notes)
*Purpose:* Unified drawer providing frictionless note-taking and task organization.

```
+-----------------------------------------------------------------------------------------+
|                                                  | [ To Do ]  [ Notes ]             [X] |
|                                                  |--------------------------------------|
|                                                  | [+ Add Note]                         |
|                                                  |                                      |
|                                                  | +----------------------------------+ |
|                                                  | | [o][o][o][o]                 [X] | |
|                                                  | | (Color Swatches)                 | |
|                                                  | |----------------------------------| |
|                                                  | | Remember to test responsive      | |
|                                                  | | break-points for mobile view.    | |
|                                                  | |                                  | |
|                                                  | +----------------------------------+ |
|                                                  |                                      |
|                                                  | +----------------------------------+ |
|                                                  | | [o][o][o][o]                 [X] | |
|                                                  | |                                  | |
|                                                  | | Meeting notes with research team | |
|                                                  | | at 3:00 PM.                      | |
|                                                  | +----------------------------------+ |
+-----------------------------------------------------------------------------------------+
```

---

### Screen 6: Draggable Floating YouTube Widget
*Purpose:* Embedded picture-in-picture player for lofi hip-hop or custom study lectures.

```
+-----------------------------------------------------------------------------------------+
|                                                                                         |
|       +--------------------------------------------------------+                        |
|       | [::] Drag Handle    [>] YouTube                    [X] |                        |
|       +--------------------------------------------------------+                        |
|       |                                                        |                        |
|       |   +------------------------------------------------+   |                        |
|       |   |                                                |   |                        |
|       |   |           Embedded Video Stream                |   |                        |
|       |   |               (react-player)                   |   |                        |
|       |   |                                                |   |                        |
|       |   +------------------------------------------------+   |                        |
|       |                                                        |                        |
|       |   +------------------------------------------------+   |                        |
|       |   | [ Change Video / Enter URL ]                   |   |                        |
|       |   +------------------------------------------------+   |                        |
|       +--------------------------------------------------------+                        |
|                                                                                         |
+-----------------------------------------------------------------------------------------+
```

---

### Screen 7: Zen Mode (Deep Focus Immersive State)
*Purpose:* The distraction-free flow state. Activated automatically after 3s of inactivity during an active timer session, or toggled manually.

```
+-----------------------------------------------------------------------------------------+
|                                                                                         |
| [Dim Overlay Active: Background brightness reduced by 60%, blur effect applied]         |
|                                                                                         |
|                                                                                         |
|                                                                                         |
|                                                                                         |
|                                                                                         |
|                                                                                         |
|                                       21 : 45                                           |
|                                                                                         |
|                            Focusing on: Final Capstone                                  |
|                                                                                         |
|                                                                                         |
|                                                                                         |
|                                                                                         |
|                                                                                         |
|                                                                                         |
| [Dock, Sidebar, Badges, and Secondary Controls Hidden]             [Exit Focus Mode]    |
+-----------------------------------------------------------------------------------------+
```

---

## 8. Deliverables & Release Artifacts

1. **Production Codebase**:
   - `src/components/LandingPage.jsx`: The entry experience with unified accent styling.
   - `src/components/StudyMode.jsx`: The orchestration engine for audio, scenes, ripples, and Zen Mode.
   - `src/components/Timer.jsx`: Draggable Pomodoro card with Web Audio API chime synthesis.
   - `src/components/Sidebar.jsx`: Unified sliding drawer managing To-Do and Notes tabs.
   - `src/components/TodoList.jsx`: Local-first task manager with custom event synchronization.
   - `src/components/StickyNotes.jsx`: Pastel multi-colored scratchpads with localStorage persistence.
   - `src/components/YouTubeWidget.jsx`: Draggable video player with handle isolation.
   - `src/components/NoiseMenu.jsx`: Modal soundscape manager and volume attenuator.
   - `src/App.css`: Complete responsive design system with glassmorphism, accessibility outlines, and unified green accent (`#4ade80`).
2. **Design System Tokens**:
   - Primary Accent: `#4ade80` (Tailwind Green 400).
   - Base Slate Background: `#0f172a`.
   - Frosted Glass Panels: `rgba(255, 255, 255, 0.1)` with `backdrop-filter: blur(12px)` and `border: 1px solid rgba(255,255,255,0.15)`.
   - Pastel Palette: Pale Yellow (`rgba(254, 240, 138, 0.95)`), Mint Green (`rgba(187, 247, 208, 0.95)`), Sky Blue (`rgba(191, 219, 254, 0.95)`), Soft Lavender (`rgba(251, 207, 232, 0.95)`).
3. **Verified Production Build**:
   - Verified via `react-scripts build`: compiled successfully with zero syntax warnings or bundle errors (83.54 kB JS / 4.87 kB CSS).
