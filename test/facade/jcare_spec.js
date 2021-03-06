import expect from "expect.js";
import sinon from "sinon";
import jsdom from "mocha-jsdom";
import jCare from "../../src/facade/jcare.js";

describe("jCare", function () {
  jsdom();

  before(function () {
    this.foundedElement = document.createElement("div");
    this.foundedElement.classList.add("test");
    document.body.appendChild(this.foundedElement);
  });

  describe("instantiate jCare", function () {
    it("without document argument", function () {
      expect(jCare).to.throwException(/document needs to be passed as argument/);
    });

    it("with document argument", function () {
      expect(jCare).withArgs(document).to.not.throwException();
    });
  });

  describe("#findClass", function () {
    let $;

    beforeEach(function () {
      $ = new jCare(document);
    });

    it("with argument return elements", function () {
      expect($.findClass("test")).not.to.be.empty;
      expect($.findClass("test").classList).to.be(this.foundedElement.classList);
    });

    it("without argument returns error", function () {
      expect($.findClass).to.throwException(/a class needs to be passed/);
    });

    it("uses querySelector if browser supports", function () {
      const querySelector = sinon.spy(document, "querySelector");

      $.findClass("test");

      sinon.assert.calledOnce(querySelector);
    });

    it("uses getElementsByClassName if browser dont supports querySelector", function () {
      $ = new jCare(document);
      document.querySelector = null;

      const getElementsByClassName = sinon.spy(document, "getElementsByClassName");

      $.findClass("test");

      sinon.assert.calledOnce(getElementsByClassName);
    });
  });
});
