'use client';
import { useParams, useRouter } from 'next/navigation';
import { StudentOrgUpdate } from '@/types';
import OrgUpdateEditForm from '../../edit-form';
import { Skeleton } from '@/components/ui/skeleton';
import { useStudentOrg } from '@/app/(student-org-panel)/layout';
import { useEffect, useState } from 'react';
import { studentOrgUpdates } from '@/lib/placeholder-data';

export default function EditOrgUpdatePage() {
  const { id } = useParams();
  const router = useRouter();
  const { organization, isLoading: orgLoading } = useStudentOrg();
  
  const updateId = typeof id === 'string' ? id : '';
  
  const [updateData, setUpdateData] = useState<StudentOrgUpdate | null | undefined>(undefined);
  const [updateLoading, setUpdateLoading] = useState(true);

  useEffect(() => {
    if (organization?.id && updateId) {
        const foundUpdate = studentOrgUpdates.find(upd => upd.id === updateId && upd.organizationId === organization.id);
        setUpdateData(foundUpdate);
    }
    setUpdateLoading(false);
  }, [organization, updateId])
  
  const isLoading = orgLoading || updateLoading;

  const handleSuccess = () => {
    router.push('/telebe-teskilati-paneli/updates');
  };
  
  if(isLoading || !organization) {
    return (
        <div className="space-y-4">
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-10 w-24" />
        </div>
    )
  }
  
  if(!updateData && !isLoading) {
    return <p>Yenilik tapılmadı.</p>
  }

  return (
    <OrgUpdateEditForm 
      onSuccess={handleSuccess}
      initialData={updateData}
      organization={organization}
    />
  );
}
