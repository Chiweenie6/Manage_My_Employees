# Manage_My_Employees
Manage employees with a command-line interface application using Node.js, Inquirer, and MySQL .

[![MIT License](https://img.shields.io/badge/License-MIT-blue)]((https://opensource.org/licenses/MIT))

## Table of Content
  - [Description](#Description)
  - [Usage](#Usage)
  - [Installation](#Installation)
  - [Contributing](#Contributing)
  - [Tests](#Tests)
  - [Questions](#Questions)
  - [License](#License)

## Description
  An application used to manage employee information using a command-line interface. Technologies involved include MySQL, Node.js and Inquirer. Gives the ability to view and alter employee information including adding new employees, company roles and departments as well as deleting old employees, roles and departments which are no longer being used and updating current employee information.
  
  Link:



  
  

## Usage
  To easlily view and interect with employee information. Having the ability to view employees, salaries, departments and roles. In addition to viewing the records, they can also be altered by adding, removing or updating new employees, company roles and departments. All data can be seen in organized tables by choosing to view different types of information.
  
  Images:  
  ![image](https://user-images.githubusercontent.com/113393706/218890012-94332dd1-f055-4c46-a061-10e0b7367a8a.png)
  ![image](https://user-images.githubusercontent.com/113393706/218890116-c917c86c-9280-4b7f-a774-38398027769a.png)
  ![image](https://user-images.githubusercontent.com/113393706/218890324-1912c402-2505-4a1e-8479-9705423d56ce.png)  
 



## Installation
  Copy application files into code.vs and then input "npm install" into the command-line. Then open mysql by typing "mysql -u yourDB_USERname -p" into the command-line and type in your password. Once logged in to mysql you need to source the sql files by typing "source DB/schema.sql;" and "source DB/seeds.sql;" into the mysql command-line. Once sourced, exit mysql by typing "exit". When back in the normal command-line, type "npm start" into the command-line and the user options list will be pulled up and you can choose what you wish to do.

## Contributing
  n/a

## Tests
  n/a

## Questions
  https://github.com/Chiweenie6  

## License
  MIT License

Copyright (c) [2023] [Kevin Breedlove]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
