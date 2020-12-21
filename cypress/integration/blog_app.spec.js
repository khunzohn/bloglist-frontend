describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3001/api/test/reset");

    const userOne = {
      username: "user one",
      name: "khun",
      password: "root",
    };
    cy.addUser(userOne);

    const userTwo = {
      username: "user two",
      name: "khun",
      password: "root",
    };
    cy.addUser(userTwo);

    cy.visit("http://localhost:3000");
  });

  it("Login form is shown", function () {
    cy.contains("Log in to application");
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.get("#username").type("user one");
      cy.get("#password").type("root");
      cy.get("#submit").click();

      cy.contains("user one logged in");
    });

    it("fails with wrong credentials", function () {
      cy.get("#username").type("user one");
      cy.get("#password").type("roots");
      cy.get("#submit").click();

      cy.get("#noti")
        .should("contain", "Wrong credentials")
        .and("have.css", "border", "5px solid rgb(255, 0, 0)");
    });
  });

  describe("When logged in", function () {
    beforeEach(() => {
      cy.login({
        username: "user one",
        password: "root",
      });
    });

    it("a blog can be created", function () {
      cy.contains("new blog").click();

      cy.get("#title").type("blog title");
      cy.get("#author").type("Khun Zohn");
      cy.get("#url").type("blog url");

      cy.get("#create-button").click();

      cy.contains("blog title");
    });

    describe("and owner blog exists", function () {
      beforeEach(function () {
        const token = JSON.parse(localStorage.getItem("user")).token;
        cy.createBlog(
          {
            title: "user one blog",
            author: "user one",
            url: "url one",
            likes: 1,
          },
          token
        );
      });

      it("user can like a blog", function () {
        cy.contains("view").click();

        cy.get("#like-button").click();

        cy.get(".divLikes").should("contain", "Likes 2");
      });

      it("owner can delete his own blog", function () {
        cy.contains("view").click();

        cy.get("#delete-button").click();

        cy.contains("user one blog").should("not.exist");
      });
    });

    describe("and other's blog exists", function () {
      beforeEach(function () {
        cy.request("POST", "http://localhost:3001/api/login", {
          username: "user two",
          password: "root",
        }).then(({ body }) => {
          const token = body.token;
          cy.createBlog(
            {
              title: "user two blog",
              author: "user two",
              url: "url two",
              likes: 1,
            },
            token
          );
        });
      });

      it("cannot delete other's blog", function () {
        cy.contains("view").click();

        cy.get("#delete-button").click();

        cy.contains("user two blog").should("exist");
      });
    });

    describe("and multiple blogs exists", function () {
      beforeEach(function () {
        cy.request("POST", "http://localhost:3001/api/login", {
          username: "user two",
          password: "root",
        }).then(({ body }) => {
          const userTwoToken = body.token;
          const userOneToken = JSON.parse(localStorage.getItem("user")).token;

          cy.createBlog(
            {
              title: "user two blog one",
              author: "user two",
              url: "url two",
              likes: 1,
            },
            userTwoToken
          );
          cy.createBlog(
            {
              title: "user two blog two",
              author: "user two",
              url: "url two",
              likes: 2,
            },
            userTwoToken
          );

          cy.createBlog(
            {
              title: "user one blog one",
              author: "user one",
              url: "url one",
              likes: 3,
            },
            userOneToken
          );
          cy.createBlog(
            {
              title: "user one blog two",
              author: "user one",
              url: "url one",
              likes: 4,
            },
            userOneToken
          );
        });
      });

      it("the blogs are orderd with the most likes being first", function () {
        cy.get(".blog button").click({ multiple: true });

        cy.get(".divLikes")
          .invoke("text")
          .then((texts) => {
            console.log("texts", texts);
            const digits = texts.match(/\d+/g).map((d) => parseInt(d));

            console.log("digits", digits);

            let sorted = true;
            for (let i = 0; i < digits.length - 1; i++) {
              if (digits[i + 1] > digits[i]) {
                sorted = false;
              }
            }

            console.log("sorted", sorted);

            cy.wrap(sorted).should("eq", true);
          });
      });
    });
  });
});
