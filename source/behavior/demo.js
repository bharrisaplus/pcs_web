(function (demoWindow, demoDoc) {
  demoWindow.onload = (_) => {
    const
      $container = demoDoc.querySelector(".closeup .turntable-container"),
      $turntable = $container.querySelector('.turntable')
      $pickup = $turntable.querySelector('.turntable-pickup'),
      $close = $turntable.querySelector(".turntable-close");
      $cuePrevious = $turntable.querySelector('.turntable-cue-lever-regression'),
      $cueNext = $turntable.querySelector('.turntable-cue-lever-progression'),
      decklist = [];

    const handlePopoverClose = () => {
      $pickup.textContent = '';

      $container.hidePopover();

      $cueNext.disabled = false;
      $cuePrevious.disabled = false;
    };

    const handlePopoverOpen = (_clickEvt) => {
      const
        openCard = _clickEvt.target?.textContent,
        openCardIdx = decklist.indexOf(openCard);

      $pickup.textContent = openCard;

      if (openCardIdx == 0) {
        $cuePrevious.disabled = true;
      } else if (openCardIdx == decklist.length - 1) {
        $cueNext.disabled = true;
      }

      $container.showPopover();
    };

    const loadCard = (_clickEvt) => {
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

      // Set new card in centerpiece and adjust buttons
      if (newIdx != currentCardIdx) {
        $pickup.textContent = decklist[newIdx];

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
      demoDoc.querySelectorAll(".closeup .pad li").forEach(($elm) => {
        decklist.push($elm.textContent);
        $elm.addEventListener("click", handlePopoverOpen);
      });

      $close.addEventListener("click", handlePopoverClose);

      $cuePrevious.addEventListener('click', (_evt) => loadCard(_evt, 0));
      $cueNext.addEventListener('click', (_evt) => loadCard(_evt, 1));
    }
  }
})(window, document);

// ◖ -> 9686 
// ◗ -> 9687
