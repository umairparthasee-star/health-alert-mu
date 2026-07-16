import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

/**
 * 1. GET: Fetch all heatzones
 * This pulls all active outbreaks & hazards to draw circles on your map.
 */
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('heatzones')
      .select('*')
      .order('created_at', { ascending: false }); // Newest reports first

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Supabase GET Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * 2. POST: Insert a new report
 * This is your original code to handle the hazard submission form.
 */
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