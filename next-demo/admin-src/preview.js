/* Decap preview templates. They render the same markup as the live site, styled by the shared pfc.css. */
(function () {
  var BASE = window.PFC_BASE || "";
  var DONATE = "https://partnershipsforchange.org/donate/";

  function band(status, since) {
    if (status === "Active") return { style: "solid", text: since ? "Active, since " + since : "Active" };
    if (status === "Completed") return { style: "archive", text: "Completed" };
    if (status === "Paused") return { style: "pending", text: "Paused" };
    return { style: "pending", text: "Status to confirm" };
  }
  function placeholder(kind) {
    if (kind === "Documentary") return "Poster from PFC needed";
    if (kind === "Book") return "Cover from PFC needed";
    return "Image from PFC needed";
  }
  function src(getAsset, value) {
    if (!value) return null;
    if (String(value).indexOf("/images/") === 0) return BASE + value;
    return getAsset(value).toString();
  }
  function tab(strand, large) {
    return h("span", { className: "tab tab--" + String(strand || "media").toLowerCase() + (large ? " tab--lg" : "") }, strand);
  }
  function bandEl(b, large) {
    return h("span", { className: "band" + (b.style === "solid" ? "" : " band--" + b.style) + (large ? " band--lg" : "") }, b.text);
  }
  function still(className, image, alt, kind) {
    return h("figure", { className: className },
      image ? h("img", { src: image, alt: alt || "" }) : h("span", { className: "placeholder" }, placeholder(kind)));
  }

  var ProjectPreview = createClass({
    render: function () {
      var d = this.props.entry.get("data");
      var b = band(d.get("status"), d.get("since"));
      return h("main", { className: "screening", style: { paddingTop: "24px" } },
        still("screening__still", src(this.props.getAsset, d.get("image")), d.get("image_alt"), d.get("kind")),
        h("h1", { className: "screening__title display" }, d.get("title") || "Untitled project"),
        h("p", { className: "screening__credits" }, d.get("place")),
        h("div", { className: "screening__meta" },
          tab(d.get("strand"), true), bandEl(b, true), h("span", { className: "sep" }),
          h("a", { className: "ticket ticket--lg", href: DONATE }, h("span", { className: "ticket__inner" }, "Donate to this project"))),
        h("div", { className: "screening__body" },
          h("div", { className: "prose" }, this.props.widgetFor("body")),
          h("dl", { className: "facts" },
            h("div", {}, h("dt", {}, "Status"), h("dd", {}, b.text)),
            h("div", {}, h("dt", {}, "Last reviewed"), h("dd", {}, String(d.get("last_reviewed") || "")))))
      );
    },
  });

  var HomePreview = createClass({
    getInitialState: function () { return { projects: null }; },
    componentDidMount: function () {
      var self = this;
      this.props.getCollection("projects").then(function (entries) {
        var map = {};
        entries.forEach(function (e) { map[e.get("slug")] = e.get("data").toJS(); });
        self.setState({ projects: map });
      });
    },
    render: function () {
      var d = this.props.entry.get("data");
      var ref = d.get("featured");
      var p = (this.state.projects && this.state.projects[ref]) ||
        (this.props.fieldsMetaData && this.props.fieldsMetaData.getIn(["featured", "projects", ref]) &&
          this.props.fieldsMetaData.getIn(["featured", "projects", ref]).toJS());
      if (!p) return h("p", { style: { padding: "24px" } }, "Choose a featured project to preview the homepage.");
      var b = band(p.status, p.since);
      var lede = String(p.body || "").trim().split(/\n\s*\n/)[0] || "";
      return h("div", {},
        h("header", { className: "masthead", style: { position: "static" } },
          h("div", { className: "masthead__row" },
            h("span", { className: "masthead__logo" }, h("img", { src: BASE + "/images/pfc-logo.png", alt: "Partnerships For Change" })),
            h("p", { className: "masthead__line" }, d.get("headline")),
            h("span"), h("span", { className: "ticket" }, "Donate"))),
        h("section", { className: "programme", style: { gridTemplateColumns: "minmax(0, 1fr)" } },
          h("article", { className: "feature" },
            still("feature__still", src(this.props.getAsset, p.image), p.image_alt, p.kind),
            h("h1", { className: "feature__title display" }, p.title),
            h("p", { className: "feature__credits" }, lede + " " + (p.place || "") + "."),
            h("div", { className: "feature__actions" },
              tab(p.strand, true), bandEl(b, true), h("span", { className: "sep" }),
              h("span", { className: "ticket ticket--lg" }, h("span", { className: "ticket__inner" }, "Donate to this project")))))
      );
    },
  });

  CMS.registerPreviewStyle(BASE + "/design/pfc.css");
  CMS.registerPreviewTemplate("projects", ProjectPreview);
  CMS.registerPreviewTemplate("home", HomePreview);
})();
