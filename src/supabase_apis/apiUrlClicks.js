import { UAParser } from 'ua-parser-js';

import supabase from '@/db/supabase';

const parser = new UAParser();

export const findTargetUrlForRedirection = async (short_url_or_custom_url) => {
  try {
    if (short_url_or_custom_url) {
      const { data, error } = await supabase
        .from('urls')
        .select('id, original_url')
        .or(
          `short_url.eq.${short_url_or_custom_url}, custom_url.eq.${short_url_or_custom_url}`
        )
        .limit(1);

      if (error) {
        console.log(error);

        throw new Error(error?.message);
      }

      return data;
    }
  } catch (error) {
    console.log(error);

    return error;
  }
};

export const storeClicksDetailsOfUrlsOnClick = async ({
  url_id,
  original_url,
}) => {
  try {
    console.log("url_id:", url_id, "original_url:", original_url);
    if (url_id && original_url) {
      const res_device = parser.getResult();

      const device_name = res_device.type || 'Desktop/Laptop';

      const res_city_country = await fetch(`https://ipapi.co/json`);

      const { city = "Unknown", country_name: country = "Unknown" } = await res_city_country.json();

      const {data,error} =await supabase.from('clicks').insert([{
        url_id: url_id,
        city: city,
        device: device_name,
        country: country,
      }]);
      console.log("Insert Response:", data);
      if (error) {
  console.log("Insert Error:", error);
}

      window.location.href = original_url;
    }
  } catch (error) {
    console.log("Insert Error:", error);

    return error;
  }
};

export const getClicksForUserUrls = async (user_id) => {
  // Get all URLs for this user
  const { data: urls } = await supabase
    .from('urls')
    .select('id')
    .eq('user_id', user_id);

  if (!urls) return [];

  const urlIds = urls.map(u => u.id);

  // Get all clicks for these URLs
  const { data: clicks } = await supabase
    .from('clicks')
    .select('*')
    .in('url_id', urlIds);

  return clicks || [];
};