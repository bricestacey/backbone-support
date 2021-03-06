describe("Support.CompositeView", function() {
  var orangeView = Support.CompositeView.extend({
    render: function() {
      var text = this.make("span", {}, "Orange!");
      $(this.el).append(text);
    }
  });

  var blankView = Support.CompositeView.extend({
    render: function() {
    }
  });

  var normalView = Backbone.View.extend({
    render: function() {
      var text = this.make("span", {}, "Normal!");
      $(this.el).append(text);
    }
  });

  beforeEach(function() {
    Helpers.setup();
    Helpers.append("test1");
    Helpers.append("test2");
  });

  afterEach(function() {
    Helpers.teardown();
  });

  describe("#renderChild", function() {
    it("renders children views", function() {
      var view = new blankView();
      view.renderChild(new orangeView({el: "#test1"}));
      view.renderChild(new orangeView({el: "#test2"}));

      expect($("#test1").text()).toEqual("Orange!");
      expect($("#test2").text()).toEqual("Orange!");
    });
  });

  describe("#appendChild", function() {
    it("renders and appends children views", function() {
      var view = new blankView({el: "#test"});
      view.appendChild(new orangeView());
      view.appendChild(new orangeView());

      expect($("#test").text()).toEqual("Orange!Orange!");
    });
  });

  describe("#renderChildInto", function() {
    it("renders child into the given element and replaces content there", function() {
      $("#test1").text("Replace this!");

      var view = new blankView({el: "#test"});
      view.renderChildInto(new orangeView(), "#test1");

      expect($("#test").text()).toEqual("");
      expect($("#test1").text()).toEqual("Orange!");
    });
  });

  describe("#appendChildInto", function() {
    it("renders child into the given element and appends content there", function() {
      $("#test1").text("Append here!");

      var view = new blankView({el: "#test"});
      view.appendChildInto(new orangeView(), view.$("#test1");

      expect($("test").text()).toEqual("");
      expect($("test1").text()).toEqual("Append here!Orange!")
    });
  });

  describe("#leave", function() {
    it("removes elements and events when leave() is called", function() {
      var view = new orangeView();
      var spy = sinon.spy(view, "unbind");

      runs(function() {
        view.render();
        $("#test").append(view.el);
      });

      Helpers.sleep();

      runs(function() {
        expect($("#test").text()).toEqual("Orange!");
      });

      Helpers.sleep();

      runs(function() {
        view.leave();
      });

      Helpers.sleep();

      runs(function() {
        expect($("#test").text()).toEqual("");
        expect(spy.called).toBeTruthy();
      });
    });

    it("removes children views on leave", function() {
      var view = new blankView();
      view.renderChild(new orangeView({el: "#test1"}));
      view.renderChild(new orangeView({el: "#test2"}));

      view.leave();

      expect($("#test1").size()).toEqual(0);
      expect($("#test2").size()).toEqual(0);
    });

    it("doesn't fail on normal backbone views that may be children", function() {
      var view = new blankView();
      view.renderChild(new orangeView({el: "#test1"}));
      view.renderChild(new normalView({el: "#test2"}));

      view.leave();

      expect($("#test1").size()).toEqual(0);
      expect($("#test2").size()).toEqual(1);
    });

    it("removes self from parent if invoked on a child view", function() {
      var view = new blankView();
      var childView = new orangeView({el: "#test1"});
      view.renderChild(childView)
      view.renderChild(new orangeView({el: "#test2"}));

      expect($("#test1").size()).toEqual(1);
      expect($("#test2").size()).toEqual(1);
      expect(view.children.size()).toEqual(2);

      childView.leave();

      expect($("#test1").size()).toEqual(0);
      expect($("#test2").size()).toEqual(1);
      expect(view.children.size()).toEqual(1);
    });
  });
});
