export const STELLA_BUNDLES = [
    { id: 'pdt_0NXuwtHgh0yJWU85Rye2P', name: 'Small', stellas: 100, price: 2900, color: 'blue' },
    { id: 'pdt_0NXuxbMQsgY22ZezqfDDL', name: 'Growth', stellas: 300, price: 6900, bestValue: true, color: 'amber' },
    { id: 'pdt_0NXuxfPPKAUuiQqNOgr7H', name: 'Pro', stellas: 600, price: 11900, color: 'purple' }
];

export const getStellaBundleById = (id: string) => STELLA_BUNDLES.find((bundle) => bundle.id === id);

export const SUBSCRIPTION_PLANS = [
    { productId: "pdt_0NWyeKym8LDKoNKB9E7do", slug: "basic-monthly", name: "Basic Plan" },
    { productId: "pdt_0NXHnRHE2WZEePYoiQlyI", slug: "creator-monthly", name: "Creator Plan" },
    { productId: "pdt_0NXHnX4Wd2XdAz47FRiof", slug: "pro-monthly", name: "Pro Plan" },
];

export const AUTH_PRODUCTS = [
    ...SUBSCRIPTION_PLANS.map(p => ({ productId: p.productId, slug: p.slug })),
    ...STELLA_BUNDLES.map(b => ({ productId: b.id, slug: `bundle-${b.name.toLowerCase()}` }))
];
