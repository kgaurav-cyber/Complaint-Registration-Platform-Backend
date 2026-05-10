// Force restart to load new .env variables
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3030;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../Frontend')));

// Supabase Database Connection
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Initialize Supabase client
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// API route to receive and store a new complaint
app.post('/api/complaints', async (req, res) => {
  const { name, city, mobile, complaint } = req.body;
  
  // Custom validation as requested
  if (!name || !complaint) {
    return res.status(400).json({ error: 'name and complaints not filled' });
  }

  if (!supabase) {
    return res.status(500).json({ error: 'Supabase credentials not configured' });
  }
  
  try {
    const { data, error } = await supabase
      .from('complaints')
      .insert([{ name, city, mobile, complaint }])
      .select();

    if (error) throw error;

    res.status(201).json({ message: 'complaints submitted successfully', complaint: data[0] });
  } catch (error) {
    console.error('Database error saving complaint:', error);
    res.status(500).json({ error: 'Failed to save complaint to database' });
  }
});

// API route to retrieve all complaints
app.get('/api/complaints', async (req, res) => {
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase credentials not configured' });
  }

  try {
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Database error retrieving complaints:', error);
    res.status(500).json({ error: 'Failed to retrieve complaints from database' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
