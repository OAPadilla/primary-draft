<div align="center">
  <a href="https://github.com/OAPadilla/primary-draft">
    <img src="public/android-chrome-512x512.png" alt="Logo" width="200" height="200">
  </a>

  <h1 align="center">Primary Draft</h1>

  <p align="center">
    Interactive 2024 Primary Election Map
    <br />
    <br />
    <a href="https://www.primarydraft.com">View Demo at PrimaryDraft.com</a>
  </p>
</div>

<!-- ABOUT THE PROJECT -->
## About The Project

Primary Draft is an interactive web app for simulating U.S. political party primary elections. Experiment with state primary election results and allocate delegates among presidential primary candidates on a United States map. Use it as an educational tool and experience democracy!

### Built With

* [Vue 3](https://vuejs.org/) - Frontend JavaScript framework
* [Vite](https://vitejs.dev/) - Frontend build tool
* [Pinia](https://pinia.vuejs.org/) - Store library for state management
* [D3](https://d3js.org/) - Visualizations via data-driven DOM manipulation

<!-- USAGE EXAMPLES -->
## Usage

1. <strong>Choose a candidate or select "None":</strong> Selecting a candidate allows you to quickly allocate a majority (50.1%) of a state's popular vote with a click. "None" allows you to allocate with total control.
2.  <strong>Click on a U.S. state or territory</strong> on the map and observe the allocation tool. Delegates are automatically calculated based on the set popular vote percentages and a state's election rules.
3. <strong>Experiment with state results.</strong> Watch the "Unallocated" row to help you keep track of yet to be distributed votes. Once 0 is reached, you won't be able to allocate any more to a candidate without taking away from another.
4. <strong>Lead a candidate to victory!</strong> A candidate is the official winner once they've earned a majority of total delegates, marked by the delegate count flag.

<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

* [Node v16+](https://nodejs.org/en)

### Installation

1. Clone the repo
   ```
   git clone https://github.com/OAPadilla/primary-draft.git
   cd primary-draft
   ```
2. Install NPM packages
   ```
   npm ci
   ```
3. Run the application
   ```
   npm run dev
   ```
4. Navigate to url
   ```
   http://localhost:5173
   ```

<!-- CONTACT -->
## Contact

Oscar Padilla - [LinkedIn](https://www.linkedin.com/in/oapadilla/) - PadillaOscarA@gmail.com

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [The Green Papers](https://www.thegreenpapers.com/) - Up-to-date election information

<!-- COPYRIGHT -->
## Copyright

Copyright © 2023, Oscar Padilla
