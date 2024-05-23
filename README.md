<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/ftrbnd/eden-heardle">
    <img src="https://i.imgur.com/rQmm1FM.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">EDEN Heardle</h3>

  <p align="center">
    A custom Heardle designed for EDEN fans
    <br />
    <a href="https://eden-heardle.io">View Demo</a>
    ·
    <a href="https://github.com/ftrbnd/eden-heardle/issues">Report Bug</a>
    ·
    <a href="https://github.com/ftrbnd/eden-heardle/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#configuration">Configuration</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://eden-heardle.io)

Just like the original Wordle, get 6 chances to guess the ~~word~~ song! 
* New daily song with the help of a dedicated [Express server](https://github.com/ftrbnd/eden-heardle-server) for running cronjobs
* Optional Discord authentication for saving statistics to the leaderboard
* View statistics in the community [Discord server](https://discord.gg/futurebound) using the [EDEN Bot](https://github.com/ftrbnd/eden-bot)
* Create custom Heardles with the help of the aforementioned Express server

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* [![Typescript][Typescript]][Typescript-url]
* [![Next][Next.js]][Next-url]
* [![React][React.js]][React-url]
* [![Tailwind][TailwindCss]][Tailwind-url]
* [![DaisyUI][DaisyUi]][Daisy-url]
* [![Prisma][PrismaOrm]][Prisma-url]
* [![Supabase][Supabase]][Supabase-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/en/) 18.17 or higher
* Secret and url for [NextAuth](https://next-auth.js.org/)
* Client keys from [Discord](https://discord.com/developers/applications)
* Database url from [Supabase](https://supabase.com)
* An [Express server](https://github.com/ftrbnd/eden-heardle-cronjobs) set up for running the daily cron job and receiving Custom Heardle requests

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/ftrbnd/eden-heardle.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Generate your Prisma client
   ```sh
   npx prisma generate
   ```
5. Start the local dev server
   ```sh
   npm run dev
   ```

### Configuration

Create a `.env` file at the root and fill out the values:
```env
  NEXTAUTH_SECRET=
  NEXTAUTH_URL=

  DISCORD_CLIENT_ID=
  DISCORD_CLIENT_SECRET=

  DATABASE_URL=
  DIRECT_URL=
  
  NEXT_PUBLIC_EXPRESS_URL=
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

### Viewing the leaderboard on the website
[![Website Leaderboard][website-leaderboard-screenshot]](https://eden-heardle.io)
### Viewing the leaderboard on the Discord server
[![Discord Leaderboard][discord-leaderboard-screenshot]](https://discord.gg/futurebound)

### Creating a Custom Heardle
**Note: An account is required to create a custom Heardle, and users are limited to 1.
Deleting a custom Heardle will again allow them to create a new custom Heardle.**
[![Custom Heardle Form][custom-heardle-form]](https://eden-heardle.io)
[![Custom Heardle Result][custom-heardle-result]](https://eden-heardle.io)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTACT -->
## Contact

Giovanni Salas - [@finalcalI](https://twitter.com/finalcali) - giosalas25@gmail.com

Project Link: [https://github.com/ftrbnd/eden-heardle](https://github.com/ftrbnd/eden-heardle)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/ftrbnd/eden-heardle.svg?style=for-the-badge
[contributors-url]: https://github.com/ftrbnd/eden-heardle/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/ftrbnd/eden-heardle.svg?style=for-the-badge
[forks-url]: https://github.com/ftrbnd/eden-heardle/network/members
[stars-shield]: https://img.shields.io/github/stars/ftrbnd/eden-heardle.svg?style=for-the-badge
[stars-url]: https://github.com/ftrbnd/eden-heardle/stargazers
[issues-shield]: https://img.shields.io/github/issues/ftrbnd/eden-heardle.svg?style=for-the-badge
[issues-url]: https://github.com/ftrbnd/eden-heardle/issues
[license-shield]: https://img.shields.io/github/license/ftrbnd/eden-heardle.svg?style=for-the-badge
[license-url]: https://github.com/ftrbnd/eden-heardle/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: https://i.imgur.com/OzETWxS.png
[website-leaderboard-screenshot]: https://i.imgur.com/dVr4AOB.png
[discord-leaderboard-screenshot]: https://i.imgur.com/3TyTIKe.png
[custom-heardle-form]: https://i.imgur.com/w0W4CFN.png
[custom-heardle-result]: https://i.imgur.com/wGNsPv2.png
[Typescript]: https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[Typescript-url]: https://www.typescriptlang.org/
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[TailwindCss]: https://img.shields.io/badge/tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white
[Tailwind-url]: https://tailwindcss.com/
[DaisyUi]: https://img.shields.io/badge/daisyui-5A0EF8?style=for-the-badge&logo=daisyui&logoColor=white
[Daisy-url]: https://daisyui.com/
[PrismaOrm]: https://img.shields.io/badge/Prisma-%232D3748?style=for-the-badge&logo=prisma&logoColor=white
[Prisma-url]: https://www.prisma.io/
[Supabase]: https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white
[Supabase-url]: https://supabase.com/
