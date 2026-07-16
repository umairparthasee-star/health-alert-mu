import { supabase } from '@/lib/supabase'; // Imports the client we just created
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('health_facilities')
      .select('*');

    if (error) throw error;
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}