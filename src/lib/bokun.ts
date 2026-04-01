export const BOKUN_CHANNEL_UUID = '44a9a7f7-bf0a-4945-ab64-57a5d5ebbaf3';
export const BOKUN_SCRIPT_URL = `https://widgets.bokun.io/assets/javascripts/apps/build/BokunWidgetsLoader.js?bookingChannelUUID=${BOKUN_CHANNEL_UUID}`;

/** Bokun E-BIKE ウィジェットID */
export const EBIKE_WIDGETS = {
  quickRide: '1163074',
  cruise: '1163501',
  allDay: '1163516',
} as const;

/** Bokun widget URL builder */
export function bokunWidgetUrl(experienceId: string): string {
  return `https://widgets.bokun.io/online-sales/${BOKUN_CHANNEL_UUID}/experience/${experienceId}`;
}
