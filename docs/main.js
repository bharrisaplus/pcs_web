(function (demoDoc) {
  if (Object.hasOwn(HTMLElement.prototype, "popover")) {
    const
      $cardPopover = demoDoc.querySelector(".closeup .centerpiece-container"),
      $cardPopoverContent = $cardPopover.querySelector('.centerpiece-content'),
      $cardPopoverClose = $cardPopover.querySelector(".centerpiece-close");
      $cardPopoverPrevious = $cardPopover.querySelector('.centerpiece-controls-previous'),
      $cardPopoverNext = $cardPopover.querySelector('.centerpiece-controls-next'),
      decklist = [];

    const handlePopoverClose = () => {
      $cardPopoverContent.textContent = '';

      $cardPopover.hidePopover();

      $cardPopoverNext.disabled = false;
      $cardPopoverPrevious.disabled = false;
    };

    const handlePopoverOpen = (_clickEvt) => {
      const
        openCard = _clickEvt.target?.textContent,
        openCardIdx = decklist.indexOf(openCard);

      $cardPopoverContent.textContent = openCard;

      if (openCardIdx == 0) {
        $cardPopoverPrevious.disabled = true;
      } else if (openCardIdx == decklist.length - 1) {
        $cardPopoverNext.disabled = true;
      }

      $cardPopover.showPopover();
    };

    const loadCard = (_clickEvt) => {
      const
        currentCardIdx = decklist.indexOf($cardPopoverContent.textContent),
        loadPrevious = _clickEvt.target === $cardPopoverPrevious,
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
        $cardPopoverContent.textContent = decklist[newIdx];

        // Prevent presses once at ends of list
        if (newIdx == 0) {
          $cardPopoverPrevious.disabled = true;
        } else if (newIdx == decklist_max) {
          $cardPopoverNext.disabled = true;
        }

        // Allow presses once away from end of list
        if (loadPrevious) {
          $cardPopoverNext.disabled = false;
        } else {
          $cardPopoverPrevious.disabled = false;
        }
      }
    }

    demoDoc.querySelectorAll(".closeup .pad li").forEach(($elm) => {
      decklist.push($elm.textContent);
      $elm.addEventListener("click", handlePopoverOpen);
    });

    $cardPopoverClose.addEventListener("click", handlePopoverClose);

    $cardPopoverPrevious.addEventListener('click', (_evt) => loadCard(_evt, 0));
    $cardPopoverNext.addEventListener('click', (_evt) => loadCard(_evt, 1));
  }
})(document);

// ◖ -> 9686 
// ◗ -> 9687