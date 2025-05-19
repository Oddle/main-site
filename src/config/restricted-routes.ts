export interface RestrictedRoutes {
  [path: string]: string[];
}

export const restrictedRoutes: RestrictedRoutes = {
  '/products/restaurant-payment-terminal': ['tw', 'hk'],
  // Add other restricted routes here:
  // e.g. '/another/path': ['locale1', 'locale2']
};

export const isRouteRestricted = (pathname: string, locale: string): boolean => {
  if (restrictedRoutes[pathname] && restrictedRoutes[pathname].includes(locale)) {
    return true;
  }
  return false;
}; 