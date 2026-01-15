(function (demoWindow, demoDoc, demoCanvasConvert) {
  demoWindow.onload = (_) => {
    const
      $container = demoDoc.querySelector(".closeup .turntable-container"),
      $turntable = $container.querySelector('.turntable'),
      $pickup = $turntable.querySelector('.turntable-pickup'),
      $close = $turntable.querySelector(".turntable-close"),
      $cuePrevious = $turntable.querySelector('.turntable-cue-lever-regression'),
      $cueNext = $turntable.querySelector('.turntable-cue-lever-progression'),
      $items = demoDoc.querySelectorAll(".closeup .pad li"),
      $exportTrigger = document.querySelector('.export button');

    const
      ndo = [],
      ndo_max = 51,
      pickup_base_class = $pickup.className;


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


    const _unloadTurntable = (_) => {
      if ($container.matches(':popover-open')) {
        $pickup.textContent = '';
        $pickup.className = pickup_base_class;

        $container.hidePopover();

        $cueNext.disabled = false;
        $cuePrevious.disabled = false;
        $exportTrigger.disabled = false;
      }
    };


    const _loadTurntable = (_clickEvt) => {
      if (!$container.matches(':popover-open')) {
        const $item = _clickEvt.target;

        if ($item && $item.textContent != $pickup.textContent) {
          const foundIdx = ndo.indexOf($item.textContent);

          if (foundIdx > -1) {
            $pickup.textContent = $item.textContent;
            $pickup.className = `${pickup_base_class} ${$item.dataset.suite} playing-card`;

            if (foundIdx == 0) {
              $cuePrevious.disabled = true;
            } else if (foundIdx == ndo.length - 1) {
              $cueNext.disabled = true;
            }

            $exportTrigger.disabled = true;
            $container.showPopover();
          } 
        }
      }
    };


    const _spinTurntable = (_clickEvt) => {
      const
        currentCardIdx = ndo.indexOf($pickup.textContent),
        loadPrevious = _clickEvt.target === $cuePrevious,
        ndo_max = ndo.length - 1;

      let newIdx;

      // Get previous or next card within list
      if (loadPrevious) {
        newIdx = Math.max(0, currentCardIdx - 1);
      } else {
        newIdx = Math.min(ndo_max, currentCardIdx + 1);
      }

      // Set new card and suite color in centerpiece and adjust buttons
      if (newIdx != currentCardIdx) {
        $pickup.textContent = ndo[newIdx];
        $pickup.className = `${pickup_base_class} ${$items[newIdx].dataset.suite} playing-card`;

        // Prevent presses once at ends of list
        if (newIdx == 0) {
          $cuePrevious.disabled = true;
        } else if (newIdx == ndo_max) {
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
        $clickTarget = _clickEvt.target,
        $capture = demoDoc.querySelector(captureQS),
        $captureStyle = (demoWindow.getComputedStyle($capture)),
        $dump = demoDoc.querySelector(dumpQS);

      let $maybeCanvas, canvas_data;

      $clickTarget.disabled = true;

      $maybeCanvas = await demoCanvasConvert($capture, {
        height: $capture.scrollHeight,
        width: $capture.getBoundingClientRect().width
      });

      canvas_data = $maybeCanvas.toDataURL('image/png');

      $dump.href = canvas_data;
      $dump.download = 'pcs_demo_ndo.png';
      $dump.textContent = '>redownload here<';

      $dump.click();

      setTimeout(() => {
        $dump.href = '';
        $dump.download = '';
        $dump.textContent = '';

        $exportTrigger.disabled = false;
        
      }, 5000);
    };


    if (Object.hasOwn(HTMLElement.prototype, "popover")) {
      $items.forEach(($elm) => {
        ndo.push($elm.textContent);
        $elm.addEventListener('mouseenter', (_evt) => _tilt_item(_evt, 9));
        $elm.addEventListener('mouseleave', (_evt) => _tilt_item(_evt, 0));  
        $elm.addEventListener("click", _loadTurntable);
      });

      $close.addEventListener("click", _unloadTurntable);
      $cuePrevious.addEventListener('click', _spinTurntable);
      $cueNext.addEventListener('click', _spinTurntable);

      $exportTrigger.addEventListener("click", (_evt) => {
        _canvasyze_rasterize_(_evt, '.closeup', '.export a')
      });
    }
  }
})(window, document, html2canvas);

// ◖ -> 9686 
// ◗ -> 9687
