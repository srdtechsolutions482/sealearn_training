
import React from 'react';
import { Button, Card, Input } from '../common/UI';
import { MapPin, Phone, Mail } from 'lucide-react';

export const ContactPage = () => (
    <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">Contact Us</h1>
        <div className="grid md:grid-cols-2 gap-8">
            <Card>
                <form className="space-y-4">
                    <Input label="Name" placeholder="Your Name" />
                    <Input label="Email" placeholder="your@email.com" />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                        <textarea className="w-full px-4 py-2 border border-gray-300 rounded-lg h-32"></textarea>
                    </div>
                    <Button>Send Message</Button>
                </form>
            </Card>
            <div className="space-y-6 flex flex-col justify-center">
                 <div className="flex items-center gap-4">
                     <div className="bg-blue-100 p-3 rounded-full text-blue-600"><MapPin /></div>
                     <div><h3 className="font-bold">Address</h3><p className="text-gray-600">123 Ocean Drive, Marina Bay</p></div>
                 </div>
                 <div className="flex items-center gap-4">
                     <div className="bg-blue-100 p-3 rounded-full text-blue-600"><Phone /></div>
                     <div><h3 className="font-bold">Phone</h3><p className="text-gray-600">+1 234 567 8900</p></div>
                 </div>
                 <div className="flex items-center gap-4">
                     <div className="bg-blue-100 p-3 rounded-full text-blue-600"><Mail /></div>
                     <div><h3 className="font-bold">Email</h3><p className="text-gray-600">support@sealearn.com</p></div>
                 </div>
            </div>
        </div>
    </div>
);
