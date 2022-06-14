import { FC, useState, useEffect } from "react";
import useSWR from "swr";
import { EyeOffIcon } from "@heroicons/react/outline";

import { fetcher } from "../utils/fetcher";

export const NftCard = ({ details, onSelect, onTokenDetailsFetched = () => { }, selected }) => {
  const [fallbackImage, setFallbackImage] = useState(false);
  const { name, uri } = details?.data ?? {};
  // console.log(details)
  const { data, error } = useSWR(
    // uri || url ? getMetaUrl(details) : null,
    uri,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  // console.log("nftcard");
  // console.log(data);

  useEffect(() => {
    if (!error && !!data) {
      onTokenDetailsFetched(data);
    }
  }, [data, error]);

  const onImageError = () => setFallbackImage(true);
  const { image } = data ?? {};

  return (
    <div className="col-sm-4 pl-0 cursor-pointer" onClick={async () => onSelect({ ...details, data: { ...details.data, metadata: data } })}>
      {!fallbackImage || !error ? (
        <img
          src={image}
          onError={onImageError}
          className={selected ? 'card-img-top mb-3 border border-white' : "card-img-top mb-3"}
        />
      ) : (
        // Fallback when preview isn't available
        // This could be broken image, video, or audio
        <div className="card-img-top mb-3">
          <EyeOffIcon className="h-16 w-16 text-white-500" />
        </div>
      )}
      {/* <img src={image} onError={onImageError} className="card-img-top mb-3" alt="..." /> */}
    </div>
    // <div className={`card bordered max-w-xs compact rounded-md`}>
    //   <figure className="min-h-16 animation-pulse-color">
    //     {!fallbackImage || !error ? (
    //       <img
    //         src={image}
    //         onError={onImageError}
    //         className="bg-gray-800 object-cover"
    //       />
    //     ) : (
    //       // Fallback when preview isn't available
    //       // This could be broken image, video, or audio
    //       <div className="w-auto h-48 flex items-center justify-center bg-gray-900 bg-opacity-40">
    //         <EyeOffIcon className="h-16 w-16 text-white-500" />
    //       </div>
    //     )}
    //   </figure>
    //   <div className="card-body">
    //     <h2 className="card-title text-sm text-left">{name}</h2>
    //   </div>
    // </div>
  );
};