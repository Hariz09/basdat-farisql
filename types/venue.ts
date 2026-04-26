export type Venue = {
  venueId: string;
  venueName: string;
  capacity: number;
  address: string;
  city: string;
  seatingType: "reserved" | "free";
};