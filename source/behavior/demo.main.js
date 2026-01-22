(function (demoWindow, demoDoc, demoCanvasConvert, demoRand) {
  demoWindow.onload = () => {
    const
      $dustCover = demoDoc.querySelector(".closeup .dust-cover"),
      $turntable = $dustCover.querySelector('.turntable'),
      $pickup = $turntable.querySelector('.turntable-pickup'),
      $turnOff = $turntable.querySelector(".turn-off"),
      $cuePrevious = $turntable.querySelector('.turntable-cue-lever-regression'),
      $cueNext = $turntable.querySelector('.turntable-cue-lever-progression'),
      $exportTrigger = demoDoc.querySelector('.ribbon .export button'),
      $shuffleTrigger = demoDoc.querySelector('.ribbon .shuffle'),
      $bgPicker = demoDoc.querySelector('.ribbon [name="bg-wells"]');

    const
      ndo = [],
      ndo_max = 51,
      suites = ['spade', 'diamond', 'club', 'heart'],
      pickup_base_class = $pickup.className,
      closeup_base_class = Array.from(demoDoc.querySelector('.closeup').classList).slice(0, -1);

    let
      decklist = [];


    const _get_suite = (ndo_idx) => suites[Math.floor(ndo_idx / 13)];

    const _tidy = (_toggleEvt) => {
      if (_toggleEvt.oldState === 'open' && _toggleEvt.newState === 'closed') {
        $pickup.textContent = '';
        $pickup.className = pickup_base_class;
        $cueNext.disabled = false;
        $cuePrevious.disabled = false;
        $exportTrigger.disabled = false;
        $shuffleTrigger.disabled = false;
        $bgPicker.disabled = false;
      } else if (_toggleEvt.oldState === 'closed' && _toggleEvt.newState === 'open') {
        $exportTrigger.disabled = true;
        $shuffleTrigger.disabled = true;
        $bgPicker.disabled = true;
      }
    };


    const _shuffle_items = () => {
      //
      // disallow buttons
      $shuffleTrigger.disabled = true;
      $exportTrigger.disabled = true;
      $bgPicker.disabled = true;
      //
      // do shuffle
      const mixed_up = demoRand.shuffle(Array.from(demoDoc.querySelectorAll('.closeup .pad li')));
      //
      // update current decklist
      decklist = mixed_up.map(($elm) => $elm.textContent);
      //
      // swapout previous decklist
      demoDoc.querySelector('.closeup .pad').replaceChildren(...mixed_up);
      //
      // allow buttons
      $exportTrigger.disabled = false;
      $bgPicker.disabled = false;

      demoWindow.setTimeout(() => {
        if (!$dustCover.matches(':popover-open')) {
          $shuffleTrigger.disabled = false;
        }
      }, 5000);
    };


    const _tilt_item = (_mouseEvt, amount) => {
      const $item = _mouseEvt.target;

      if ($item) {
        const
          _prefix = amount == 0 ? `` : `-`,
          rotate_amount = `${_prefix}${amount}deg`;

        if ($item.style.rotate != rotate_amount) {
          $item.style.rotate = rotate_amount;
        }
      }
    };


    const _loadTurntable = (_clickEvt) => {
      if (!$dustCover.matches(':popover-open')) {
        const $item = _clickEvt.target;

        if ($item && $item.textContent != $pickup.textContent) {
          const found_idx = ndo.indexOf($item.textContent);

          if (found_idx > -1) {
            $pickup.textContent = $item.textContent;
            $pickup.className = `${pickup_base_class} ${_get_suite(found_idx)} playing-card`;

            if (found_idx == 0) {
              $cuePrevious.disabled = true;
            } else if (found_idx == ndo_max) {
              $cueNext.disabled = true;
            }

            $dustCover.showPopover();
          } 
        }
      }
    };


    const _spinTurntable = (_clickEvt) => {
      const
        current_idx = decklist.indexOf($pickup.textContent),
        loadPrevious = _clickEvt.target === $cuePrevious;

      let spun_idx;

      // Get previous or next card within list
      if (loadPrevious) {
        spun_idx = Math.max(0, current_idx - 1);
      } else {
        spun_idx = Math.min(ndo_max, current_idx + 1);
      }

      // Set new card and suite color in centerpiece and adjust buttons
      if (spun_idx != current_idx) {
        const
          spun_item = decklist[spun_idx],
          spun_suite = _get_suite((ndo.indexOf(spun_item)));

        $pickup.textContent = spun_item;
        $pickup.className = `${pickup_base_class} ${spun_suite} playing-card`;

        // Prevent presses once at ends of list
        if (spun_idx == 0) {
          $cuePrevious.disabled = true;
        } else if (spun_idx == ndo_max) {
          $cueNext.disabled = true;
        }

        // Allow presses once away from end of list
        if (loadPrevious) {
          $cueNext.disabled = false;
        } else {
          $cuePrevious.disabled = false;
        }
      }
    };


    const _canvasyze_rasterize_ = async (_clickEvt, captureQS, dumpQS) => {
      const
        $capture = demoDoc.querySelector(captureQS),
        $dump = demoDoc.querySelector(dumpQS);

      let $maybeCanvas, canvas_data;

      $exportTrigger.disabled = true;
      $shuffleTrigger.disabled = true;
      $bgPicker.disabled = true;

      $maybeCanvas = await demoCanvasConvert($capture, {
        windowHeight: '810',
        windowWidth: '1904',
        scale: '1.0'
      });

      canvas_data = $maybeCanvas.toDataURL('image/png');

      $dump.href = canvas_data;
      $dump.download = 'pcs_demo_ndo.png';
      $dump.textContent = 'redownload here';

      $dump.click();

      $shuffleTrigger.disabled = false;
      $bgPicker.disabled = false;

      demoWindow.setTimeout(() => {
        $dump.href = '';
        $dump.download = '';
        $dump.textContent = '';

        if (!$dustCover.matches(':popover-open')) {
          $exportTrigger.disabled = false;
        }
      }, 5000);
    };


    if (Object.hasOwn(HTMLElement.prototype, "popover")) {
      demoDoc.querySelectorAll(".closeup .pad li").forEach(($elm) => {
        ndo.push($elm.textContent);
        $elm.addEventListener('mouseenter', (_evt) => _tilt_item(_evt, 9));
        $elm.addEventListener('mouseleave', (_evt) => _tilt_item(_evt, 0));
        $elm.addEventListener("click", _loadTurntable);
      });

      decklist = Array.from(ndo);

      $dustCover.addEventListener('beforetoggle', _tidy);
      $turnOff.addEventListener("click", () => $dustCover.hidePopover());
      $cuePrevious.addEventListener('click', _spinTurntable);
      $cueNext.addEventListener('click', _spinTurntable);

      $exportTrigger.addEventListener("click", (_evt) => {
        _canvasyze_rasterize_(_evt, '.closeup', '.ribbon .export a');
      });

      $shuffleTrigger.addEventListener('click', _shuffle_items);

      $bgPicker.value = '0';
      $bgPicker.addEventListener('change', (_evt) => {
        const
          choosenBG = _evt.target?.value || 0,
          $closeup = demoDoc.querySelector('.closeup');

        switch(choosenBG) {
          case '1': $closeup.className = `${closeup_base_class} green-dye`; break;
          case '2': $closeup.className = `${closeup_base_class} red-dye`; break;
          case '3': $closeup.className = `${closeup_base_class} blue-dye`; break;
          case '4': $closeup.className = `${closeup_base_class} purple-dye`; break;
          case '0':
          default:
        }
      });
    }
  }
})(window, document, html2canvas, chance);

// ◖ -> 9686
// ◗ -> 9687
