export function initTabsBoard() {
  const tabs = document.querySelectorAll('[data-msg-tab-target]');
  const tabContents = document.querySelectorAll('[data-msg-tab-content]');
  const cleanups = [];

  tabs.forEach((tab) => {
    const handleClick = () => {
      const target = document.querySelector(tab.dataset.msgTabTarget);

      if (!target) {
        return;
      }

      tabContents.forEach((tabContent) => {
        tabContent.classList.remove('active-tab');
      });
      target.classList.add('active-tab');
    };

    tab.addEventListener('click', handleClick);
    cleanups.push(() => tab.removeEventListener('click', handleClick));
  });

  return () => {
    for (const cleanup of cleanups) {
      cleanup();
    }
  };
}
