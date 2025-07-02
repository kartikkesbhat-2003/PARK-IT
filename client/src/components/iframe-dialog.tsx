import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  url: string;
}

const IFrameDialog: React.FC<Props> = ({ open, setOpen, url }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="!w-[900px] h-[500px]">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m20!1m8!1m3!1d3784.4002589278643!2d73.83114307519028!3d18.46552033261741!3m2!1i1024!2i768!4f13.1!4m9!3e0!4m3!3m2!1d18.465564!2d73.8337099!4m3!3m2!1d18.465477099999998!2d73.8336944!5e0!3m2!1sen!2sin!4v1748870995963!5m2!1sen!2sin"
              width="600"
              height="450"
              style="border:0;"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default IFrameDialog;
