export function Tabs({ activeTab, tabs, onChange }) {
  return (
    <nav className="tabs" aria-label="Messenger sections">
      {tabs.map((tab) => (
        <button
          aria-current={activeTab === tab.id ? 'page' : undefined}
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
