(function (demoWindow, demoDoc) {
  demoWindow.onload = (_) => {
    const
      $container = demoDoc.querySelector(".closeup .turntable-container"),
      $turntable = $container.querySelector('.turntable'),
      $pickup = $turntable.querySelector('.turntable-pickup'),
      $close = $turntable.querySelector(".turntable-close"),
      $cuePrevious = $turntable.querySelector('.turntable-cue-lever-regression'),
      $cueNext = $turntable.querySelector('.turntable-cue-lever-progression'),
      decklist = [],
      pickup_base_class = $pickup.className,
      $items = demoDoc.querySelectorAll(".closeup .pad li");


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
      }
    };

    const _loadTurntable = (_clickEvt) => {
      if (!$container.matches(':popover-open')) {
        const $item = _clickEvt.target;

        if ($item && $item.textContent != $pickup.textContent) {
          const foundIdx = decklist.indexOf($item.textContent);

          if (foundIdx > -1) {
            $pickup.textContent = $item.textContent;
            $pickup.className = `${pickup_base_class} ${$item.dataset.suite}`;

            if (foundIdx == 0) {
              $cuePrevious.disabled = true;
            } else if (foundIdx == decklist.length - 1) {
              $cueNext.disabled = true;
            }

            $container.showPopover();
          } 
        }
      }
    };

    const _spinTurntable = (_clickEvt) => {
      const
        currentCardIdx = decklist.indexOf($pickup.textContent),
        loadPrevious = _clickEvt.target === $cuePrevious,
        decklist_max = decklist.length - 1;

      let newIdx;

      // Get previous or next card within list
      if (loadPrevious) {
        newIdx = Math.max(0, currentCardIdx - 1);
      } else {
        newIdx = Math.min(decklist_max, currentCardIdx + 1);
      }

      // Set new card and suite color in centerpiece and adjust buttons
      if (newIdx != currentCardIdx) {
        $pickup.textContent = decklist[newIdx];
        $pickup.className = `${pickup_base_class} ${$items[newIdx].dataset.suite}`;

        // Prevent presses once at ends of list
        if (newIdx == 0) {
          $cuePrevious.disabled = true;
        } else if (newIdx == decklist_max) {
          $cueNext.disabled = true;
        }

        // Allow presses once away from end of list
        if (loadPrevious) {
          $cueNext.disabled = false;
        } else {
          $cuePrevious.disabled = false;
        }
      }
    }

    if (Object.hasOwn(HTMLElement.prototype, "popover")) {
      $items.forEach(($elm) => {
        decklist.push($elm.textContent);
        $elm.addEventListener('mouseenter', (_evt) => _tilt_item(_evt, 9));
        $elm.addEventListener('mouseleave', (_evt) => _tilt_item(_evt, 0));  
        $elm.addEventListener("click", _loadTurntable);
      });

      $close.addEventListener("click", _unloadTurntable);
      $cuePrevious.addEventListener('click', _spinTurntable);
      $cueNext.addEventListener('click', _spinTurntable);
    }
  }
})(window, document);

// ◖ -> 9686 
// ◗ -> 9687
