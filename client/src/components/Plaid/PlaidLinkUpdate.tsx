import { Button } from '@material-tailwind/react';
import React, { useEffect } from 'react';
import { PlaidLinkOptions, usePlaidLink } from 'react-plaid-link';

/* Update Plaid Login Information for an Account */

export function PlaidLinkUpdate({ link_tokens, setUpdateLinkTokens, refetchBalance }: any) {

  const onLoad = () => {
    const elm: any = document.getElementById("plaidUpdateLink");
    elm.click();
  }

  const plaidConfig: PlaidLinkOptions = {
    token: link_tokens[0],
    onSuccess: (() => { console.log("Update Successful!"); refetchBalance(); setUpdateLinkTokens(link_tokens.slice(1)) }),
    onExit: (() => { console.log("Update Failed!"); setUpdateLinkTokens(link_tokens.slice(1)) }),
    onLoad: onLoad
  }

  const { open, ready } = usePlaidLink(plaidConfig)


  return (
    <Button onClick={() => open()} disabled={!ready} id="plaidUpdateLink" className="hidden">
      Add Bank Account
    </Button>
  );
}