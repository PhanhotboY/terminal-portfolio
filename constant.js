export const PORTFOLIO = {
  education: [
    '<br>',
    '<white>education</white>',
    [
      [
        'University of Information Technology',
        'https://en.wikipedia.org/wiki/University_of_Information_Technology',
        'Information Technology',
        '2021-2025 (expected)',
      ],
    ].map(
      ([university, url, major, year]) =>
        `* <a href="${url}" target="_blank">${university}</a> <yellow>"${major}"</yellow> ${year}`
    ),
    '<br>',
  ].flat(),
  projects: [
    '<br>',
    '<white>Open Source projects</white>',
    [
      [
        'jQuery Terminal',
        'https://terminal.jcubic.pl',
        'library that adds terminal interface to websites',
      ],
    ].map(([name, url, description = '']) => {
      return `* <a href="${url}">${name}</a> &mdash; ${description}`;
    }),
    '<br>',
  ].flat(),
  skills: [
    '<br>',
    '<white>languages</white>',
    ['JavaScript', 'TypeScript', 'Python', 'SQL', 'Solidity'].map(
      (lang) => `* <yellow>${lang}</yellow>`
    ),

    '<br>',
    '<white>libraries/frameworks</white>',
    ['Express.js', 'React.js', 'Next.js', 'Ethers.js', 'Jest'].map(
      (lib) => `* <green>${lib}</green>`
    ),

    '<br>',
    '<white>tools</white>',
    ['Docker', 'git', 'MySQL', 'MongoDB', 'AWS', 'Redis', 'GNU/Linux'].map(
      (lib) => `* <blue>${lib}</blue>`
    ),
    '<br>',
  ].flat(),
};

export const COMMANDS = {
  help: {
    description: 'list all available commands',
    exec() {
      return [
        '',
        '<white>Available commands:</white>',
        ...Object.entries(COMMANDS).map(
          ([cmd, { description }]) =>
            `* <yellow class="command">${cmd}</yellow>${
              cmd.length > 5 ? '' : '\t'
            }\t\t&mdash; ${description}`
        ),
        '',
        'Click on the command to execute it',
        '',
      ].join('\n');
    },
  },
  echo: {
    description: 'echo the arguments',
    exec(...args) {
      if (args.length > 0) return args.join(' ');
    },
  },
  whoami: {
    description: 'print the current user',
    exec() {
      return USER;
    },
  },
  ls: {
    description: 'list directory contents',
    exec(dir = null) {
      if (dir) {
        if (dir.match(/^~\/?$/)) {
          // ls ~ or ls ~/
          return print_dirs();
        } else if (dir.startsWith('~/')) {
          const path = dir.substring(2);
          const dirs = path.split('/');
          if (dirs.length > 1) {
            this.error('Invalid directory');
          } else {
            const dir = dirs[0];
            this.echo(PORTFOLIO[dir].join('\n'));
          }
        } else if (cwd === ROOT) {
          if (dir in PORTFOLIO) {
            this.echo(PORTFOLIO[dir].join('\n'));
          } else {
            this.error('Invalid directory');
          }
        } else if (dir === '..') {
          return print_dirs();
        } else {
          this.error('Invalid directory');
        }
      } else if (cwd === ROOT) {
        return print_dirs();
      } else {
        const dir = cwd.substring(2);
        this.echo(PORTFOLIO[dir].join('\n'));
      }
    },
  },
  cd: {
    description: 'change the current directory',
    exec(dir = null) {
      if (dir === null || (dir === '..' && cwd !== ROOT)) {
        cwd = ROOT;
      } else if (dir.startsWith('~/') && DIRS.includes(dir.substring(2))) {
        cwd = dir;
      } else if (DIRS.includes(dir)) {
        cwd = ROOT + '/' + dir;
      } else {
        this.error('Wrong directory');
      }
    },
  },
  cat: {
    description: 'concatenate files and print on the standard output',
    exec(file) {
      return (
        PORTFOLIO[file]?.join('\n') || `cat: ${file}: No such file or directory`
      );
    },
  },
  pwd: {
    description: 'print the current working directory',
    exec() {
      return `<orange>${cwd}</orange>`;
    },
  },
  joke: {
    description: 'get a random programming joke',
    async exec() {
      const res = await fetch(jokeUrl);
      const data = await res.json();
      if (data.type == 'twopart') {
        // as said before in every function, passed directly
        // to the terminal, you can use `this` object
        // to reference terminal instance
        return `Q: ${data.setup}\nA: ${data.delivery}`;
      } else if (data.type === 'single') {
        return data.joke;
      }
    },
  },
  credits: {
    description: 'list the used libraries',
    exec() {
      return [
        '',
        '<white>Used libraries:</white>',
        '* <a href="https://terminal.jcubic.pl">jQuery Terminal</a>',
        '* <a href="https://github.com/patorjk/figlet.js/">Figlet.js</a>',
        '* <a href="https://github.com/jcubic/isomorphic-lolcat">Isomorphic Lolcat</a>',
        '* <a href="https://jokeapi.dev/">Joke API</a>',
        '',
      ].join('\n');
    },
  },
  clear: {
    description: 'clear the terminal screen',
    exec() {
      this.clear();
    },
  },
};

const jokeUrl = 'https://v2.jokeapi.dev/joke/Programming';
const ROOT = '~';
export let cwd = ROOT;
const USER = 'guest';
const SERVER = 'phannd';
const DIRS = Object.keys(PORTFOLIO);

const print_dirs = () =>
  DIRS.map((dir) => {
    return `<orange class="directory">${dir}</orange>`;
  }).join('\n');

export const data = {
  USER,
  SERVER,
  DIRS,
  ROOT,
};
