const request = require("supertest");
const http = require("http");
const app = require("@api/app").default;

async function getFreshApiKey() {
  const username = `testuser_${Date.now()}`;
  const email = `testuser_${Date.now()}@example.com`;
  const password = "password";
  const agent = request.agent(app);

  await agent.post("/api/v1/auth/register").send({
    username,
    email,
    password,
  });
  await agent.post("/api/v1/auth/login").send({ username, password });

  const profile = await agent.get("/api/v1/users/profile");
  return profile.body.data.profile.api_key;
}

describe("Integration Tests", () => {
  const apiBaseUrl = "/api/v1";
  const authBaseUrl = apiBaseUrl + "/auth";
  const usersBaseUrl = apiBaseUrl + "/users";
  const experiencesBaseUrl = apiBaseUrl + "/experiences";

  let apiKey;

  beforeAll(async () => {
    // Create a test user and fetch its API key
    const agent = request.agent(app);
    await agent.post(authBaseUrl + "/register").send({
      username: "user1",
      email: "user1@example.com",
      password: "password",
    });

    await agent
      .post(authBaseUrl + "/login")
      .send({ username: "user1", password: "password" });

    const profile = await agent.get(usersBaseUrl + "/profile");
    apiKey = profile.body.data.profile.api_key;
  });

  describe("Smoke Test", () => {
    let httpServer;
    beforeAll((done) => {
      httpServer = http.createServer(app);

      // Capture any unhandled exceptions or warnings
      process.once("uncaughtException", (error) => done(error));
      process.once("unhandledRejection", (error) => done(error));

      httpServer.listen(process.env.HTTP_PORT, () => {
        done();
      });
    });

    afterAll((done) => {
      httpServer.close(done);
    });

    it("should start without errors or warnings", (done) => {
      done();
    });
  });

  describe("Auth", () => {
    describe("POST /register", () => {
      it("should return 200 and register successfully", async () => {
        await request(app)
          .post(authBaseUrl + "/register")
          .send({
            username: "test",
            email: "test@example.com",
            password: "test",
          })
          .expect(200)
          .expect((res) => {
            expect(res.body).toEqual({
              code: 200,
              status: "success",
              data: {
                message: "Registration successful",
                userInfo: expect.objectContaining({
                  id: expect.any(Number),
                  username: "test",
                  email: "test@example.com",
                }),
              },
            });
          });
      });

      it("should return 400 for existing username", async () => {
        await request(app)
          .post(authBaseUrl + "/register")
          .send({
            username: "test",
            email: "another@example.com",
            password: "test",
          })
          .expect(400)
          .expect((res) => {
            expect(res.body).toEqual({
              code: 400,
              status: "error",
              data: {
                message: "Username already in use",
              },
            });
          });
      });

      it("should return 400 for existing email", async () => {
        await request(app)
          .post(authBaseUrl + "/register")
          .send({
            username: "another",
            email: "test@example.com",
            password: "test",
          })
          .expect(400)
          .expect((res) => {
            expect(res.body).toEqual({
              code: 400,
              status: "error",
              data: {
                message: "Email already in use",
              },
            });
          });
      });
    });

    describe("POST /login", () => {
      it("should return 200 and login successfully", async () => {
        await request(app)
          .post(authBaseUrl + "/login")
          .send({ username: "test", password: "test" })
          .expect(200)
          .expect((res) => {
            expect(res.body).toEqual({
              code: 200,
              status: "success",
              data: {
                message: "Login successful",
                settings: expect.any(Object),
              },
            });
          });
      });

      it("should return 401 for invalid credentials", async () => {
        await request(app)
          .post(authBaseUrl + "/login")
          .send({ username: "test", password: "notPassword" })
          .expect(401)
          .expect((res) => {
            expect(res.body).toEqual({
              code: 401,
              status: "error",
              data: {
                message: "Invalid Credentials",
              },
            });
          });
      });
    });

    describe("POST /logout", () => {
      it("should return 200 and logout successfully", async () => {
        await request(app)
          .post(authBaseUrl + "/logout")
          .expect(200)
          .expect((res) => {
            expect(res.body).toEqual({
              code: 200,
              status: "success",
              data: {
                message: "Logout successful",
              },
            });
          });
      });
    });

    describe("POST /verify", () => {
      it("should return 200 and verify successfully with message", async () => {
        await request(app)
          .post(authBaseUrl + "/verify")
          .set("Authorization", `Bearer ${await getFreshApiKey()}`)
          .send({ message: "hello, world" })
          .expect(200)
          .expect((res) => {
            expect(res.body).toEqual({
              code: 200,
              status: "success",
              data: {
                message: "hello, world",
              },
            });
          });
      });

      it("should return 200 and verify successfully without message", async () => {
        await request(app)
          .post(authBaseUrl + "/verify")
          .set("Authorization", `Bearer ${await getFreshApiKey()}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toEqual({
              code: 200,
              status: "success",
              data: {
                message: "OK",
              },
            });
          });
      });
    });
  });

  describe("Experiences", () => {
    describe("GET /", () => {
      it("should return 200 and list all experiences", async () => {
        await request(app)
          .get(experiencesBaseUrl)
          .set("Authorization", `Bearer ${await getFreshApiKey()}`)
          .send()
          .expect(200)
          .expect((res) => {
            expect(res.body).toEqual({
              code: 200,
              status: "success",
              data: {
                message: "Experiences successfully retrieved",
                experiences: [],
              },
            });
          });
      });
    });

    describe("POST /connect", () => {
      let connectApiKey;
      beforeAll(async () => {
        connectApiKey = await getFreshApiKey();
      });

      it("should return 200 and connect to an experience", async () => {
        await request(app)
          .post(experiencesBaseUrl + "/connect")
          .set("Authorization", `Bearer ${connectApiKey}`)
          .send({
            roblox_experience_id: 5195557959,
            page_link: "https://www.roblox.com/games/5195557959",
            name: "Dungeon Odyssey",
          })
          .expect(200)
          .expect((res) => {
            expect(res.body).toEqual({
              code: 200,
              status: "success",
              data: {
                message: "Experience successfully connected",
              },
            });
          });
      });

      it("should return 400 if user already connected the experience", async () => {
        await request(app)
          .post(experiencesBaseUrl + "/connect")
          .set("Authorization", `Bearer ${connectApiKey}`)
          .send({
            roblox_experience_id: 5195557959,
            page_link: "https://www.roblox.com/games/5195557959",
            name: "Dungeon Odyssey",
          })
          .expect(400)
          .expect((res) => {
            expect(res.body).toEqual({
              code: 400,
              status: "error",
              data: {
                message: "Experience already connected",
              },
            });
          });
      });
    });

    describe("POST /disconnect", () => {
      it("should return 501 for not implemented", async () => {
        await request(app)
          .post(experiencesBaseUrl + "/disconnect")
          .set("Authorization", `Bearer ${await getFreshApiKey()}`)
          .send()
          .expect(501)
          .expect((res) => {
            expect(res.body).toEqual({
              code: 501,
              status: "error",
              data: {
                message: "Not Implemented",
              },
            });
          });
      });
    });

    describe("GET /analytics", () => {
      it("should return 501 for not implemented", async () => {
        await request(app)
          .get(experiencesBaseUrl + "/analytics")
          .set("Authorization", `Bearer ${await getFreshApiKey()}`)
          .expect(501)
          .expect((res) => {
            expect(res.body).toEqual({
              code: 501,
              status: "error",
              data: {
                message: "Not Implemented",
              },
            });
          });
      });
    });

    describe("GET /performance", () => {
    //   let performanceApiKey;
    //   beforeAll(async () => {
    //     performanceApiKey = await getFreshApiKey();
    //     await request(app)
    //       .post(experiencesBaseUrl + "/connect")
    //       .set("Authorization", `Bearer ${performanceApiKey}`)
    //       .send({
    //         roblox_experience_id: 5195557959,
    //         page_link: "https://www.roblox.com/games/5195557959",
    //         name: "Dungeon Odyssey",
    //       })
    //       .expect(200);
    //   });

    //   it("should return 200 and performance data", async () => {
    //     await request(app)
    //       .get(experiencesBaseUrl + "/performance?experience_id=5195557959")
    //       .set("Authorization", `Bearer ${performanceApiKey}`)
    //       .expect(200)
    //       .expect((res) => {
    //         expect(res.body).toEqual({
    //           code: 200,
    //           status: "success",
    //           data: {
    //             message: "Performance data successfully retrieved",
    //             keys: expect.any(Array),
    //             data: expect.any(Array),
    //           },
    //         });
    //       });
    //   });
    });

    describe("GET /players", () => {});

    describe("GET /purchases", () => {});

    describe("GET /social", () => {});
  });
});
