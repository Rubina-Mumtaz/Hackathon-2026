import { supabase } from './supabaseClient';

const BOOKING_PREFIX = '#BK-';

const createBookingId = async () => {
  const { data, error } = await supabase
    .from('bookings')
    .select('booking_id')
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) throw error;

  const lastId = data?.[0]?.booking_id?.match(/\d+/)?.[0] || '0';
  const nextNumber = Number(lastId) + 1;
  return `${BOOKING_PREFIX}${nextNumber}`;
};

export const createBooking = async ({ customer_id, provider_id, service, booking_date, booking_time, location, description }) => {
  const bookingId = await createBookingId();

  const { data, error } = await supabase
    .from('bookings')
    .insert([
      {
        booking_id: bookingId,
        customer_id,
        provider_id,
        service,
        booking_date,
        booking_time,
        location,
        description,
        status: 'Pending',
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getCustomerBookings = async (userId) => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`*, profiles!bookings_provider_id_fkey(full_name, role)`) 
    .eq('customer_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getProviderBookings = async (userId) => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`*, profiles!bookings_customer_id_fkey(full_name)`) 
    .eq('provider_id', userId)
    .in('status', ['Pending', 'Accepted', 'In Progress'])
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const updateBookingStatus = async (id, providerId, newStatus) => {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status: newStatus })
    .eq('id', id)
    .eq('provider_id', providerId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const submitReview = async ({ booking_id, customer_id, rating, comment }) => {
  const { data: existingReview, error: duplicateCheckError } = await supabase
    .from('reviews')
    .select('id')
    .eq('booking_id', booking_id)
    .single();

  if (duplicateCheckError && duplicateCheckError.code !== 'PGRST116') {
    throw duplicateCheckError;
  }

  if (existingReview) {
    throw new Error('Review already exists for this booking.');
  }

  const { data, error } = await supabase
    .from('reviews')
    .insert([
      {
        booking_id,
        customer_id,
        rating,
        comment,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};
