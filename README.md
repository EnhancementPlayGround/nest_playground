## 항해 플러스와 함께하는 역량 강화 프로젝트

### Intro

> CI/CD, TDD, DDD, 모니터링 시스템, 장애 대응을 공부하면서 적용해보기 위한 레포지토리

### Initialize

```bash
$ git clone https://github.com/EnhancementPlayGround/nest_playground.git
$ cd nest_playground
$ npm install
$ docker compose up --build server
```

### Tech Stack

| Name       |      Description      |
| ---------- | :-------------------: |
| Node.js    |  자바스크립트 런타임  |
| TypeScript |     타입스크립트      |
| Nest.js    |     웹 프레임워크     |
| MySQL      |          DB           |
| TypeORM    |          ORM          |
| Docker     |     컨테이너 관리     |
| ECS        | AWS Container Service |
| CloudWatch |    모니터링 시스템    |
| SonarCloud |    코드 품질 관리     |
| Jest       |        테스트         |
| Github     |       형상관리        |

### Project Structure

```bash
.
├── src
│   ├── main.ts
│   ├── @types
│   ├── config
│   ├── libs
│   ├── middlewares
│   ├── migrations
│   ├── services
│   |   ├── 각 도메인별 폴더
│   |   |   ├── presentation
│   |   |   ├── application
│   |   |   ├── domain
│   |   |   ├── infrastructure
│   |   |   ├── dto
│   |   |   └── module.ts
```
