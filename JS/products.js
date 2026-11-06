window.DKC_DATA = (() => {
  const ICON = {
    monitor: '<rect x="3" y="4" width="18" height="12" rx="1"/><path d="M8 20h8M12 16v4"/>',
    laptop: '<rect x="5" y="5" width="14" height="10" rx="1"/><path d="M2 19h20"/>',
    chip: '<rect x="7" y="7" width="10" height="10" rx="1"/><path d="M9 3v4M15 3v4M9 17v4M15 17v4M3 9h4M3 15h4M17 9h4M17 15h4"/>',
    keyboard: '<rect x="2" y="6" width="20" height="12" rx="1"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/>',
    network: '<rect x="3" y="14" width="18" height="6" rx="1"/><path d="M7 17h.01M11 17h.01M8 10a6 6 0 0 1 8 0M5 7a10 10 0 0 1 14 0"/>',
    server: '<rect x="3" y="3" width="18" height="7" rx="1"/><rect x="3" y="14" width="18" height="7" rx="1"/><path d="M7 6.5h.01M7 17.5h.01"/>'
  };
  const C = (id, name, desc, icon, subs) =>
    ({ id, name, desc, icon: ICON[icon], subs: subs.map(([sid, sname]) => ({ id: sid, name: sname })) });
  const P = (id, name, brand, cat, sub, price, stock, desc) =>
    ({ id, name, brand, cat, sub, price, stock, desc });

  const categories = [
    C('desktop-pcs', 'Desktop PCs', 'Office, gaming, and workstation builds.', 'monitor',
      [['office', 'Office PCs'], ['gaming', 'Gaming PCs'], ['workstation', 'Workstations']]),
    C('laptops', 'Laptops', 'Portable power for study, work, and play.', 'laptop',
      [['school', 'School & Office'], ['gaming', 'Gaming Laptops']]),
    C('components', 'Computer Components', 'Build, upgrade, and customize.', 'chip',
      [['cpu', 'Processors'], ['gpu', 'Graphics Cards'], ['board', 'Motherboards'], ['ram', 'Memory (RAM)'],
       ['storage', 'SSDs & HDDs'], ['case', 'Cases'], ['psu', 'Power Supplies']]),
    C('gaming-accessories', 'Gaming Accessories', 'Monitors, peripherals, and everyday gear.', 'keyboard',
      [['monitors', 'Monitors'], ['peripherals', 'Keyboards & Mice'], ['headsets', 'Headsets']]),
    C('networking', 'Networking Equipment', 'Gear for stable, connected spaces.', 'network',
      [['switches', 'Routers & Switches'], ['wifi', 'Access Points'], ['cabling', 'Cabling & Fiber']]),
    C('servers', 'Servers & Workstations', 'Reliable business infrastructure.', 'server',
      [['servers', 'Servers'], ['pro', 'Professional Workstations'], ['rack', 'Racks & Storage']])
  ];

  const products = [
    P('d1', 'Budget Office Desktop', 'DKC Build', 'desktop-pcs', 'office', 18500, 'in', 'Everyday office, school, and browsing tasks.'),
    P('d2', 'Mid-Range Gaming PC', 'DKC Build', 'desktop-pcs', 'gaming', 42900, 'low', 'Smooth 1080p gaming with room to upgrade.'),
    P('d3', 'Professional Workstation', 'DKC Build', 'desktop-pcs', 'workstation', 95000, 'order', 'For design, editing, and heavy multitasking.'),
    P('l1', '14-inch Student Laptop', 'ASUS', 'laptops', 'school', 27900, 'in', 'Light and portable for classes and office work.'),
    P('l2', 'Gaming Laptop', 'MSI', 'laptops', 'gaming', 69900, 'order', 'Dedicated graphics for games and creative apps.'),
    P('c1', 'Intel Core Processor', 'Intel', 'components', 'cpu', 12900, 'in', 'Desktop processor for office and gaming builds.'),
    P('c2', 'AMD Ryzen Processor', 'AMD', 'components', 'cpu', 11500, 'in', 'Multi-core performance for builds of all sizes.'),
    P('c3', 'AMD Radeon Graphics Card', 'AMD', 'components', 'gpu', 18900, 'low', 'Graphics card for gaming and display-heavy work.'),
    P('c4', 'NVIDIA GeForce Graphics Card', 'NVIDIA', 'components', 'gpu', 21900, 'in', 'Graphics card for gaming and content creation.'),
    P('c5', 'ATX Motherboard', 'ASUS', 'components', 'board', 8900, 'in', 'Full-size board with modern connectivity.'),
    P('c6', '16GB DDR4 Memory Kit', 'Kingston', 'components', 'ram', 2100, 'in', 'Dual-channel memory for smoother multitasking.'),
    P('c7', '512GB NVMe SSD', 'Crucial', 'components', 'storage', 2600, 'in', 'Fast storage for boot drives and games.'),
    P('c8', 'ATX Mid-Tower Case', 'Cooler Master', 'components', 'case', 2900, 'low', 'Airflow-focused case for standard builds.'),
    P('c9', '650W Power Supply', 'Corsair', 'components', 'psu', 3500, 'out', 'Efficient power for mid-range systems.'),
    P('a1', '24-inch Monitor', 'LG', 'gaming-accessories', 'monitors', 6900, 'in', 'Full HD display for work and entertainment.'),
    P('a2', 'Keyboard & Mouse Combo', 'Logitech', 'gaming-accessories', 'peripherals', 1200, 'in', 'Reliable everyday typing and pointing.'),
    P('a3', 'Gaming Headset', 'Razer', 'gaming-accessories', 'headsets', 2400, 'low', 'Comfortable headset with a boom microphone.'),
    P('n1', '8-Port Gigabit Switch', 'TP-Link', 'networking', 'switches', 1500, 'in', 'Expand wired connections in shops and offices.'),
    P('n2', 'Wi-Fi Access Point', 'Ubiquiti', 'networking', 'wifi', 5800, 'order', 'Dependable wireless coverage for business spaces.'),
    P('n3', 'Cat6 Network Cable Box', 'Generic', 'networking', 'cabling', 4200, 'in', 'Cable for structured LAN installations.'),
    P('s1', 'Tower Server', 'Dell', 'servers', 'servers', null, 'order', 'Entry-level server for small business needs.'),
    P('s2', 'Dual-Monitor Workstation', 'DKC Build', 'servers', 'pro', null, 'order', 'Configured to the needs of your workload.'),
    P('s3', '12U Network Rack', 'Generic', 'servers', 'rack', 9800, 'in', 'Wall or floor rack for networking equipment.')
  ];

  return { categories, products };
})();