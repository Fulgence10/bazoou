export function inputShowImage(inputClass, container = null) {
  const inputs = µ(inputClass, true);
  inputs.on("change", function (e) {
    container = container != null ? µ(container).native : this.parent.native;

    let img = µ("img", null, container);
    if (img.native) {
      img.hide();
    } else {
      img = µ(new Image());
      img.addToDOM(container);
      img.hide();
    }
    let file = this.native.files[0];
    let url = URL.createObjectURL(file);
    img.attr("src", url);
    img.show();
  });
}

export function checkedMobile(callback = null) {
  const chekebox = µ(".chekebox", true);
  const inputs = µ(".chekebox input", true);

  chekebox.loop((ch) =>
    µ().createElement("div").addClass("cursor-check").addToDOM(ch)
  );
  µ(".cursor-check", true).click((ev) => ev.stopPropagation());

  function toggleCheckbox(e) {
    let input = µ("input", null, this.native);

    this.toggle("active");

    this.has("active")
      ? (input.native.checked = true)
      : (input.native.checked = false);

    if (callback) {
      callback(input, e);
    }
  }

  inputs.loop((inp) => {
    if (inp.native.checked) {
      inp.parent.addClass("active");
    }
  });

  chekebox.click(toggleCheckbox);
}

export function stepForm() {
  const pagesContainer = µ(".pages-container");
  const pages = µ(".page", true);
  const btnPrev = µ(".btn-step-prev", true);
  const btnNext = µ(".btn-step-next", true);
  const steps = µ(".step", true);

  if (pagesContainer.native) {
    pagesContainer.css("width", `calc(100% * ${pages.count})`);
    pagesContainer.css("height", `${pages.native.offsetHeight}px`);
  }

  µ(".alert-danger").css("display", "none");

  btnNext.loop((btn, i) => {
    btn.click(function (e) {
      let parent = this.parent.parent;
      let inputs = µ("input", true, parent);

      let err = 0;
      let errDiv = µ(".alert-danger");

      inputs.loop((inp) => {
        if (inp.native.checkValidity()) {
          inp.removeClass("error-input");
        } else {
          err++;
          inp.addClass("error-input");
        }
      });

      if(err > 0) {
          errDiv.html('Veillez remplir tout les champ').css('display', 'block');
          pagesContainer.css("height", `${pages.natives[i].offsetHeight}px`);
          return false;
      }

      errDiv.css("display", "none");

      let currentPage = i + 1;
      pagesContainer.css("height", `${pages.natives[i + 1].offsetHeight}px`);
      pagesContainer.css(
        "transform",
        `translateX(${currentPage * (-100 / pages.count)}%)`
      );
      steps.index(i).addClass("active");
    });
  });

  btnPrev.loop((btn, i) => {
    btn.click((e) => {
      let currentPage = i + 1;
      pagesContainer.css("height", `${pages.natives[i].offsetHeight}px`);
      pagesContainer.css(
        "transform",
        `translateX(${(currentPage - 1) * (-100 / pages.count)}%)`
      );
      steps.index(i).removeClass("active");
    });
  });
}
