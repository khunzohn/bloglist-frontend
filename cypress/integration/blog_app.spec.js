describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3001/api/test/reset");

    const user = {
      username: "khunzohn",
      name: "khun",
      password: "root",
    };
    cy.request("POST", "http://localhost:3001/api/users/", user);
    cy.visit("http://localhost:3000");
  });
  it("Login form is shown", function () {
    cy.contains("Log in to application");
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.get("#username").type("khunzohn");
      cy.get("#password").type("root");
      cy.get("#submit").click();

      cy.contains("khunzohn logged in");
    });

    it("fails with wrong credentials", function () {
      cy.get("#username").type("khunzohn");
      cy.get("#password").type("roots");
      cy.get("#submit").click();

      cy.get("#noti")
        .should("contain", "Wrong credentials")
        .and("have.css", "border", "5px solid rgb(255, 0, 0)");
    });
  });

  describe.only("When logged in", function () {
    beforeEach(() => {
      const user = {
        username: "khunzohn",
        password: "root",
      };
      cy.request("POST", "http://localhost:3001/api/login/", user).then(
        (response) => {
          localStorage.setItem("user", JSON.stringify(response.body));
          cy.visit("http://localhost:3000");
        }
      );

      
    });

    it("a blog can be created", function () {
      cy.contains("new blog").click();

      cy.get("#title").type("blog title");
      cy.get("#author").type("Khun Zohn");
      cy.get("#url").type("blog url");

      cy.get("#create-button").click();

      cy.contains("blog title");
    });
  });
});
