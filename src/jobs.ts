type Job = (done: () => void) => void;

class Jobs {
  jobs: Job[] = [];
  private run = (id: number) => {
    console.log(`Job ${id}/${this.jobs.length} start`)
    this.jobs[id - 1](() => {
      const jobsCount = this.jobs.length;
      if (id === jobsCount) {
        console.log(`All ${jobsCount} jobs done`);
        this.jobs = [];
      } else {
        console.log(`Job ${id}/${jobsCount} done`);
        this.run(id + 1);
      }
    });
  }
  add = (job: Job) => {
    this.jobs.push(job);
    const id = this.jobs.length;
    console.log(`Job ${id} added`);
    if (id === 1)
      this.run(id);
    return this;
  };
}

const jobs = new Jobs();

export default jobs;