const request = require("supertest");
const http = require("http");
const app = require("@api/app").default;

const apiBaseUrl = "/api/v1";
const authBaseUrl = apiBaseUrl + "/auth";
const experiencesBaseUrl = apiBaseUrl + "/experiences";
const placesBaseUrl = apiBaseUrl + "/places";
const robloxBaseUrl = apiBaseUrl + "/roblox";
const usersBaseUrl = apiBaseUrl + "/users";

async function getFreshApiKey() {
  const username = `testuser_${Date.now()}`;
  const email = `testuser_${Date.now()}@example.com`;
  const password = "password";
  const agent = request.agent(app);

  await agent.post(authBaseUrl + "/register").send({
    username,
    email,
    password,
  });
  await agent.post(authBaseUrl + "/login").send({ username, password });

  const profile = await agent.get("/api/v1/users/profile");
  return profile.body.data.profile.api_key;
}

describe("Integration Tests", () => {
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

  describe("/auth", () => {
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
      let testKey;
      beforeAll(async () => {
        testKey = await getFreshApiKey();
      });

      it("should return 200 and verify successfully with message", async () => {
        await request(app)
          .post(authBaseUrl + "/verify")
          .set("Authorization", `Bearer ${testKey}`)
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
          .set("Authorization", `Bearer ${testKey}`)
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

  describe("/experiences", () => {
    describe("GET /", () => {
      let testKey;
      beforeAll(async () => {
        testKey = await getFreshApiKey();
        await request(app)
          .post(experiencesBaseUrl + "/connect")
          .set("Authorization", `Bearer ${testKey}`)
          .send({
            roblox_experience_id: 5195557959,
            page_link: "https://www.roblox.com/games/5195557959",
            name: "Dungeon Odyssey",
          })
          .expect(200);
      });

      it("should return 200 and list all experiences", async () => {
        await request(app)
          .get(experiencesBaseUrl)
          .set("Authorization", `Bearer ${testKey}`)
          .send()
          .expect(200)
          .expect((res) => {
            expect(res.body).toEqual({
              code: 200,
              status: "success",
              data: {
                message: "Experiences successfully retrieved",
                experiences: expect.any(Array),
              },
            });
          });
      });
    });

    describe("POST /connect", () => {
      let testKey;
      beforeAll(async () => {
        testKey = await getFreshApiKey();
      });

      it("should return 200 and connect to an experience", async () => {
        await request(app)
          .post(experiencesBaseUrl + "/connect")
          .set("Authorization", `Bearer ${testKey}`)
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
          .set("Authorization", `Bearer ${testKey}`)
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
      let testKey;
      let experienceId;
      beforeAll(async () => {
        testKey = await getFreshApiKey();
        await request(app)
          .post(experiencesBaseUrl + "/connect")
          .set("Authorization", `Bearer ${testKey}`)
          .send({
            roblox_experience_id: 5195557959,
            page_link: "https://www.roblox.com/games/5195557959",
            name: "Dungeon Odyssey",
          })
          .expect(200);

        const result = await request(app)
          .get(experiencesBaseUrl)
          .set("Authorization", `Bearer ${testKey}`)
          .expect(200);

        experienceId = result.body.data.experiences[0].experience_id;
      });

      it("should return 200 and performance data", async () => {
        await request(app)
          .get(
            experiencesBaseUrl + `/performance?experience_id=${experienceId}`
          )
          .set("Authorization", `Bearer ${testKey}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toEqual({
              code: 200,
              status: "success",
              data: {
                message: "Performance data successfully retrieved",
                keys: expect.any(Array),
                data: expect.any(Array),
              },
            });
          });
      });
    });

    describe("GET /players", () => {
      let testKey;
      let experienceId;
      beforeAll(async () => {
        testKey = await getFreshApiKey();
        await request(app)
          .post(experiencesBaseUrl + "/connect")
          .set("Authorization", `Bearer ${testKey}`)
          .send({
            roblox_experience_id: 5195557959,
            page_link: "https://www.roblox.com/games/5195557959",
            name: "Dungeon Odyssey",
          })
          .expect(200);

        const result = await request(app)
          .get(experiencesBaseUrl)
          .set("Authorization", `Bearer ${testKey}`)
          .expect(200);

        experienceId = result.body.data.experiences[0].experience_id;
      });

      it("should return 200 and players data", async () => {
        await request(app)
          .get(experiencesBaseUrl + `/players?experience_id=${experienceId}`)
          .set("Authorization", `Bearer ${testKey}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toEqual({
              code: 200,
              status: "success",
              data: {
                message: "Players data successfully retrieved",
                keys: expect.any(Array),
                data: expect.any(Array),
              },
            });
          });
      });
    });

    describe("GET /purchases", () => {
      let testKey;
      let experienceId;
      beforeAll(async () => {
        testKey = await getFreshApiKey();
        await request(app)
          .post(experiencesBaseUrl + "/connect")
          .set("Authorization", `Bearer ${testKey}`)
          .send({
            roblox_experience_id: 5195557959,
            page_link: "https://www.roblox.com/games/5195557959",
            name: "Dungeon Odyssey",
          })
          .expect(200);

        const result = await request(app)
          .get(experiencesBaseUrl)
          .set("Authorization", `Bearer ${testKey}`)
          .expect(200);

        experienceId = result.body.data.experiences[0].experience_id;
      });

      it("should return 200 and purchases data", async () => {
        await request(app)
          .get(experiencesBaseUrl + `/purchases?experience_id=${experienceId}`)
          .set("Authorization", `Bearer ${testKey}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toEqual({
              code: 200,
              status: "success",
              data: {
                message: "Purchases data successfully retrieved",
                keys: expect.any(Array),
                data: expect.any(Array),
              },
            });
          });
      });
    });

    describe("GET /social", () => {
      let testKey;
      let experienceId;
      beforeAll(async () => {
        testKey = await getFreshApiKey();
        await request(app)
          .post(experiencesBaseUrl + "/connect")
          .set("Authorization", `Bearer ${testKey}`)
          .send({
            roblox_experience_id: 5195557959,
            page_link: "https://www.roblox.com/games/5195557959",
            name: "Dungeon Odyssey",
          })
          .expect(200);

        const result = await request(app)
          .get(experiencesBaseUrl)
          .set("Authorization", `Bearer ${testKey}`)
          .expect(200);

        experienceId = result.body.data.experiences[0].experience_id;
      });

      it("should return 200 and social data", async () => {
        await request(app)
          .get(experiencesBaseUrl + `/social?experience_id=${experienceId}`)
          .set("Authorization", `Bearer ${testKey}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toEqual({
              code: 200,
              status: "success",
              data: {
                message: "Social data successfully retrieved",
                keys: expect.any(Array),
                data: expect.any(Array),
              },
            });
          });
      });
    });
  });

  describe("/places", () => {
    let testKey;
    let experienceId;
    beforeAll(async () => {
      testKey = await getFreshApiKey();
      await request(app)
        .post(experiencesBaseUrl + "/connect")
        .set("Authorization", `Bearer ${testKey}`)
        .send({
          roblox_experience_id: 5195557959,
          page_link: "https://www.roblox.com/games/5195557959",
          name: "Dungeon Odyssey",
        })
        .expect(200);

      const result = await request(app)
        .get(experiencesBaseUrl)
        .set("Authorization", `Bearer ${testKey}`)
        .expect(200);

      experienceId = result.body.data.experiences[0].experience_id;
    });

    describe("GET /", () => {
      it("should return 200 and list all places", async () => {
        await request(app)
          .get(placesBaseUrl + `?experience_id=${experienceId}`)
          .set("Authorization", `Bearer ${testKey}`)
          .send()
          .expect(200)
          .expect((res) => {
            expect(res.body).toEqual({
              code: 200,
              status: "success",
              data: {
                message: "Places successfully retrieved",
                places: expect.any(Array),
              },
            });
          });
      });
    });

    describe("GET /analytics", () => {
      it("should return 501 for not implemented", async () => {
        await request(app)
          .get(placesBaseUrl + "/analytics")
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
      let placeId;
      beforeAll(async () => {
        const result = await request(app)
          .get(placesBaseUrl + `?experience_id=${experienceId}`)
          .set("Authorization", `Bearer ${testKey}`);

        placeId = result.body.data.places[0].place_id;
      });

      it("should return 200 and performance data", async () => {
        await request(app)
          .get(placesBaseUrl + `/performance?place_id=${placeId}`)
          .set("Authorization", `Bearer ${testKey}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toEqual({
              code: 200,
              status: "success",
              data: {
                message: "Performance data successfully retrieved",
                keys: expect.any(Array),
                data: expect.any(Array),
              },
            });
          });
      });
    });

    describe("GET /players", () => {
      let placeId;
      beforeAll(async () => {
        const result = await request(app)
          .get(placesBaseUrl + `?experience_id=${experienceId}`)
          .set("Authorization", `Bearer ${testKey}`);

        placeId = result.body.data.places[0].place_id;
      });

      it("should return 200 and players data", async () => {
        await request(app)
          .get(placesBaseUrl + `/players?place_id=${placeId}`)
          .set("Authorization", `Bearer ${testKey}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toEqual({
              code: 200,
              status: "success",
              data: {
                message: "Players data successfully retrieved",
                keys: expect.any(Array),
                data: expect.any(Array),
              },
            });
          });
      });
    });

    describe("GET /purchases", () => {
      let placeId;
      beforeAll(async () => {
        const result = await request(app)
          .get(placesBaseUrl + `?experience_id=${experienceId}`)
          .set("Authorization", `Bearer ${testKey}`);

        placeId = result.body.data.places[0].place_id;
      });

      it("should return 200 and purchases data", async () => {
        await request(app)
          .get(placesBaseUrl + `/purchases?place_id=${placeId}`)
          .set("Authorization", `Bearer ${testKey}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toEqual({
              code: 200,
              status: "success",
              data: {
                message: "Purchases data successfully retrieved",
                keys: expect.any(Array),
                data: expect.any(Array),
              },
            });
          });
      });
    });

    describe("GET /social", () => {
      let placeId;
      beforeAll(async () => {
        const result = await request(app)
          .get(placesBaseUrl + `?experience_id=${experienceId}`)
          .set("Authorization", `Bearer ${testKey}`);

        placeId = result.body.data.places[0].place_id;
      });

      it("should return 200 and social data", async () => {
        await request(app)
          .get(placesBaseUrl + `/social?place_id=${placeId}`)
          .set("Authorization", `Bearer ${testKey}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toEqual({
              code: 200,
              status: "success",
              data: {
                message: "Social data successfully retrieved",
                keys: expect.any(Array),
                data: expect.any(Array),
              },
            });
          });
      });
    });
  });

  describe("/roblox", () => {
    // describe("POST /place-details", () => {
    //   let testKey;
    //   let experienceId;
    //   let placeId;
    //   beforeAll(async () => {
    //     testKey = await getFreshApiKey();
    //     await request(app)
    //       .post(experiencesBaseUrl + "/connect")
    //       .set("Authorization", `Bearer ${testKey}`)
    //       .send({
    //         roblox_experience_id: 5195557959,
    //         page_link: "https://www.roblox.com/games/5195557959",
    //         name: "Dungeon Odyssey",
    //       })
    //       .expect(200);

    //     const experiencesResult = await request(app)
    //       .get(experiencesBaseUrl)
    //       .set("Authorization", `Bearer ${testKey}`)
    //       .expect(200);

    //     experienceId = experiencesResult.body.data.experiences[0].experience_id;

    //     const placesResult = await request(app)
    //       .get(placesBaseUrl + `?experience_id=${experienceId}`)
    //       .set("Authorization", `Bearer ${testKey}`)
    //       .expect(200);

    //     placeId = placesResult.body.data.places[0].place_id;
    //   });

    //   it("should return 200 and place details", async () => {
    //     await request(app)
    //       .post(robloxBaseUrl + "/place-details")
    //       .set("Authorization", `Bearer ${testKey}`)
    //       .send({ place_id: placeId })
    //       .expect(200)
    //       .expect((res) => {
    //         expect(res.body).toEqual({
    //           code: 200,
    //           status: "success",
    //           data: {
    //             message: "Place details successfully retrieved",
    //             placeDetails: expect.objectContaining({
    //               place_id: expect.any(Number),
    //               name: expect.any(String),
    //               description: expect.any(String),
    //               experienceId: expect.any(Number),
    //               thumbnails: expect.any(Array),
    //             }),
    //           },
    //         });
    //       });
    //   });
    // });
  });
});
