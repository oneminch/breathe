# Breathe
#### Guided breathing techniques
Practice common breathing techniques using guided visualizations
- 4-7-8 Method
- Box breathing
- Deep Breathing
- Equal Breathing
- Breath Counting
- Rhythmic Breathing

Technology used: HTML, CSS(SCSS), Vanilla JavaScript (Bundled with Webpack/Babel)

### File Structure

- [./src/](https://github.com/oneminch/breathe/tree/master/src) - inlcudes JavaScript files
    - [main.js](https://github.com/oneminch/breathe/tree/master/src/main.js) - contains the list of techniques, and it is responsible for rendering and functionality.
      - Techniques are stored as objects in an array list:
      ```
      {
		    id: 1,
    		name: "Name of Breathing Technique",
		    desc: "This is the description of the technique",
		    secs: [4, 4, 4, 4]  // [breathe in, hold in, breathe out, hold out]
      }
      ```
- [./dist](https://github.com/oneminch/breathe/tree/master/dist) - includes the bundled js file
- [./img](https://github.com/oneminch/breathe/tree/master/img) - inlcudes logos and image files used for the project.
- [./css](https://github.com/oneminch/breathe/tree/master/css) - inlcudes the css files and fonts used for this project.


### Contribute

- Fork this repo and clone it to your device.
- Install: 
    - Modules - `npm install`
- The file structure is as described above.
- The main CSS file for this project (`style.css`) is compiled from the `style.scss` file located in the same directory. 
    - To code some CSS, please modify the .scss file,
    - To compile .scss file to .css, open Git Bash in your root directory and run `npx sass assets/css/style.scss assets/css/style.css`.
- If JavaScript files in src/ are modified, or if you are done making changes, all you need to do is push and the GitHub actions file I set up will automatically build it. 
- Then submit a pull request
