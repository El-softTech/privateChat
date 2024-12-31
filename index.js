import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "data.json";
const git = simpleGit();

const markCommit = (x, y) => {
  const date = moment()
    .subtract(1, "y")
    .add(1, "d")
    .add(x, "w")
    .add(y, "d")
    .format();

  const data = { date: date };

  jsonfile.writeFile(path, data, (err) => {
    if (err) return console.error("Error writing file:", err);
    console.log(`File written with date: ${date}`);
    git.add([path], (err) => {
      if (err) return console.error("Error adding file:", err);
      console.log(`File added: ${path}`);
      git.commit(date, { "--date": date }, (err) => {
        if (err) return console.error("Error committing file:", err);
        console.log(`Commit made with date: ${date}`);
        git.push((err) => {
          if (err) return console.error("Error pushing commit:", err);
          console.log(`Pushed commit with date: ${date}`);
        });
      });
    });
  });
};

const makeCommits = (n) => {
  if (n === 0) {
    git.push((err) => {
      if (err) return console.error("Error pushing final commit:", err);
      console.log('Final push successful');
    });
    return;
  }
  
  const x = random.int(0, 54);
  const y = random.int(0, 6);
  const date = moment().subtract(1, "y").add(1, "d").add(x, "w").add(y, "d").format();

  const data = { date: date };
  console.log(date);

  jsonfile.writeFile(path, data, (err) => {
    if (err) return console.error("Error writing file:", err);
    git.add([path], (err) => {
      if (err) return console.error("Error adding file:", err);
      git.commit(date, { "--date": date }, (err) => {
        if (err) return console.error("Error committing file:", err);
        makeCommits(--n);
      });
    });
  });
};

makeCommits(100);
