import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // 1. Parse the incoming JSON data from the frontend form
    const body = await request.json();
    const { 
      disease_type, 
      risk_type, 
      location_name, 
      description, 
      severity_level, 
      latitude, 
      longitude 
    } = body;

    // 2. Simple validation check to ensure required columns aren't blank
    if (!risk_type || !location_name || !severity_level || !latitude || !longitude) {
      return NextResponse.json(
        { error: "Missing required fields: risk_type, location_name, severity_level, latitude, or longitude." },
        { status: 400 }
      );
    }

    // 3. Perform the database insert into the 'heatzones' table
    const { data, error } = await supabase
      .from('heatzones')
      .insert([
        { 
          disease_type: disease_type || null, // Can be null if it's just a general health hazard
          risk_type, 
          location_name, 
          description, 
          severity_level, 
          latitude: parseFloat(latitude), 
          longitude: parseFloat(longitude)
        }
      ])
      .select(); // Re-selects the newly created row to return to the frontend

    // 4. Handle database errors gracefully
    if (error) throw error;

    // 5. Send back a success response containing the new database entry
    return NextResponse.json({ success: true, data: data[0] }, { status: 201 });

  } catch (error) {
    console.error("Supabase Insert Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}