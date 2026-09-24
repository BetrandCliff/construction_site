export type Design = {
  slug: string; title: string; category: string; location: string; status: string;
  year: number; area: string; plotSize: string; floors: number; bedrooms: number;
  bathrooms: number; toilets: number; livingRooms: number; kitchens: number;
  description: string; image: string; features: string[]; documents: {name:string; type:string; size:string; description:string}[];
};

export const designs: Design[] = [
  {
    slug:"modern-4-bedroom-villa", title:"Modern 4-Bedroom Villa", category:"Residential",
    location:"Buea, Cameroon", status:"Available", year:2026, area:"285 m²", plotSize:"600 m²",
    floors:2, bedrooms:4, bathrooms:3, toilets:4, livingRooms:2, kitchens:1,
    description:"A contemporary family villa designed for comfortable living, natural lighting and efficient use of space.",
    image:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80",
    features:["Large master bedroom","Open-plan kitchen and dining","Covered parking","Balcony","Laundry room","Guest toilet","Private outdoor space"],
    documents:[
      {name:"Architectural Floor Plan",type:"PDF",size:"2.4 MB",description:"Ground and first-floor room layout with dimensions."},
      {name:"Electrical Plan",type:"PDF",size:"1.2 MB",description:"Lighting, sockets and electrical points."},
      {name:"Plumbing Plan",type:"PDF",size:"1.0 MB",description:"Water supply and drainage layout."},
      {name:"Bill of Quantities",type:"PDF",size:"3.1 MB",description:"Estimated materials and construction quantities."},
      {name:"3D Model",type:"GLB",size:"8.6 MB",description:"Interactive 3D building model for visualization."}
    ]
  },
  {
    slug:"compact-3-bedroom-house", title:"Compact 3-Bedroom House", category:"Residential",
    location:"Limbe, Cameroon", status:"Concept", year:2026, area:"168 m²", plotSize:"400 m²",
    floors:1, bedrooms:3, bathrooms:2, toilets:3, livingRooms:1, kitchens:1,
    description:"A practical single-storey home that balances construction cost, comfort and usable living space.",
    image:"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80",
    features:["Single storey","Three bedrooms","Dining area","Front porch","Two bathrooms","Storage room"],
    documents:[
      {name:"Floor Plan",type:"PDF",size:"1.8 MB",description:"Detailed floor plan with dimensions."},
      {name:"Roof Plan",type:"PDF",size:"900 KB",description:"Roof structure and drainage arrangement."},
      {name:"Structural Notes",type:"PDF",size:"1.4 MB",description:"General structural construction notes."}
    ]
  },
  {
    slug:"family-duplex-design", title:"Family Duplex Design", category:"Residential",
    location:"Bamenda, Cameroon", status:"Completed", year:2025, area:"320 m²", plotSize:"700 m²",
    floors:2, bedrooms:5, bathrooms:4, toilets:5, livingRooms:2, kitchens:1,
    description:"A spacious duplex designed for a large family with distinct private and social spaces.",
    image:"https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=80",
    features:["Five bedrooms","Family lounge","Guest suite","Double parking","Large kitchen","Balconies"],
    documents:[
      {name:"Complete Architectural Set",type:"PDF",size:"5.8 MB",description:"Full architectural drawings for the building."},
      {name:"Structural Drawings",type:"PDF",size:"4.2 MB",description:"Foundation, columns, beams and slab drawings."},
      {name:"Quantity Estimate",type:"XLSX",size:"2.0 MB",description:"Material and cost estimate spreadsheet."},
      {name:"3D Exterior",type:"GLB",size:"11.2 MB",description:"Exterior visualization model."}
    ]
  }
];