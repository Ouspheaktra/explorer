import { execSync } from "child_process";

type Job = (done: () => void) => void;

class Jobs {
  jobs: Job[] = [];
  private autoShutdown = false;
  private run = (id: number) => {
    console.log(`Job ${id}/${this.jobs.length} start`);
    this.jobs[id - 1](() => {
      const jobsCount = this.jobs.length;
      if (id === jobsCount) {
        console.log(`All ${jobsCount} jobs done`);
        this.jobs = [];
        // auto shudown
        if (this.autoShutdown === true) {
          execSync("shutdown /s /t 60", {
            shell: "C:\\Windows\\System32\\cmd.exe",
          });
          console.log("shutdown command activated");
        }
      } else {
        console.log(`Job ${id}/${jobsCount} done`);
        this.run(id + 1);
      }
    });
  };
  setAutoShutdown = (set: boolean) => {
    this.autoShutdown = set;
    if (set) {
      console.log("Jobs: auto-shutdown is set");
    } else {
      execSync("shutdown /a", {
        shell: "C:\\Windows\\System32\\cmd.exe",
      });
      console.log("Jobs: auto-shutdown is canceled");
    }
  };
  add = (job: Job) => {
    this.jobs.push(job);
    const id = this.jobs.length;
    console.log(`Job ${id} added`);
    if (id === 1) this.run(id);
    return this;
  };
}

const jobs = new Jobs();

export default jobs;
